import { randomUUID } from "node:crypto";
import { Router, type Request, type Response } from "express";
import type { RowDataPacket } from "mysql2/promise";
import { z } from "zod";
import { hashToken, newToken, requireAuth, requireRole } from "../auth";
import { beginTransaction, execute, rows } from "../db";
import { ApiError, asyncRoute } from "../errors";
import { config } from "../config";
import { sendActionEmail } from "../mailer";

export const adminRouter = Router();

const directoryQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(4),
  q: z.string().trim().max(120).default(""),
});

const exportQuerySchema = z.object({
  q: z.string().trim().max(120).default(""),
});

const validationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(4),
  type: z.enum(["all", "project", "company", "student", "payment"]).default("all"),
});

const companyDirectoryQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(9),
  q: z.string().trim().max(120).default(""),
  industry: z.string().trim().max(120).default(""),
});

const validationReviewSchema = z.object({
  status: z.enum(["verified", "rejected"]),
}).strict();

const inviteSchema = z.object({
  name: z.string().trim().min(2).max(160),
  email: z.string().trim().email().max(254).transform((email) => email.toLowerCase()),
  university: z.string().trim().min(2).max(180),
}).strict();

interface StudentDirectoryRow extends RowDataPacket {
  id: string;
  name: string;
  email: string;
  university: string;
  status: "pending" | "active" | "suspended";
  email_verified_at: Date | string | null;
  created_at: Date | string;
}

interface ValidationRow extends RowDataPacket {
  type: "project" | "company" | "student" | "payment";
  id: string;
  label: string;
  title: string;
  detail: string;
  submitter_name: string;
  submitter_detail: string;
  image_file_id: string | null;
  attachment_file_id: string | null;
  amount: number | string | null;
  method: string | null;
  created_at: Date | string;
}

interface CompanyDirectoryRow extends RowDataPacket {
  id: string;
  company_name: string;
  industry: string;
  website: string | null;
  verification_status: "pending" | "verified" | "rejected";
  account_name: string;
  email: string;
  logo_file_id: string | null;
  active_projects: number | string;
  created_at: Date | string;
}

const pendingValidationsQuery = `(
  SELECT
    'project' AS type, p.id, 'Project Proposal' AS label, p.title,
    CONCAT(p.category, ' • ', LEFT(p.description, 140)) AS detail,
    cp.company_name AS submitter_name,
    IF(cp.verified = TRUE, 'VERIFIED COMPANY', 'COMPANY ACCOUNT') AS submitter_detail,
    cp.logo_file_id AS image_file_id, NULL AS attachment_file_id,
    NULL AS amount, NULL AS method, p.created_at
  FROM projects p
  JOIN company_profiles cp ON cp.user_id = p.company_id
  WHERE p.status = 'pending'

  UNION ALL

  SELECT
    'company' AS type, cp.user_id AS id, 'Company Registration' AS label,
    cp.company_name AS title,
    CONCAT(COALESCE(cp.industry, 'Industry not provided'), ' • ', COALESCE(cp.website, 'Company profile')) AS detail,
    u.name AS submitter_name, u.email AS submitter_detail,
    cp.logo_file_id AS image_file_id, NULL AS attachment_file_id,
    NULL AS amount, NULL AS method, u.created_at
  FROM company_profiles cp
  JOIN users u ON u.id = cp.user_id
  WHERE cp.verification_status = 'pending'

  UNION ALL

  SELECT
    'student' AS type, sp.user_id AS id, 'Student Verification' AS label,
    CONCAT(COALESCE(sp.university, 'University not provided'), ' • ', COALESCE(sp.major, 'Major not provided')) AS title,
    IF(sp.resume_file_id IS NULL, 'Student profile review', 'Resume attached for review') AS detail,
    u.name AS submitter_name, u.email AS submitter_detail,
    NULL AS image_file_id, sp.resume_file_id AS attachment_file_id,
    NULL AS amount, NULL AS method, u.created_at
  FROM student_profiles sp
  JOIN users u ON u.id = sp.user_id
  WHERE sp.verification_status = 'pending'
    AND u.status = 'active' AND u.email_verified_at IS NOT NULL

  UNION ALL

  SELECT
    'payment' AS type, t.id, 'Payment Validation' AS label,
    CASE t.plan
      WHEN 'student_premium' THEN 'Student Premium'
      WHEN 'company_premium' THEN 'Company Premium'
      ELSE t.plan
    END AS title,
    CONCAT(UPPER(t.method), ' • Rp ', FORMAT(t.amount, 0)) AS detail,
    u.name AS submitter_name, u.email AS submitter_detail,
    NULL AS image_file_id, t.proof_file_id AS attachment_file_id,
    t.amount, t.method, t.created_at
  FROM transactions t
  JOIN users u ON u.id = t.user_id
  WHERE t.status = 'pending'
)`;

adminRouter.get(
  "/dashboard",
  requireAuth,
  requireRole("admin"),
  asyncRoute(async (_request: Request, response: Response) => {
    const metricRows = await rows<RowDataPacket[]>(
      `SELECT
         (SELECT COUNT(*) FROM users WHERE role = 'student') AS total_students,
         (SELECT COUNT(*) FROM company_profiles) AS total_companies,
         (SELECT COUNT(*) FROM projects WHERE status = 'approved') AS approved_projects,
         (SELECT COUNT(*) FROM projects WHERE status = 'pending')
           + (SELECT COUNT(*) FROM company_profiles WHERE verification_status = 'pending')
           + (SELECT COUNT(*)
              FROM student_profiles sp
              JOIN users u ON u.id = sp.user_id
              WHERE sp.verification_status = 'pending'
                AND u.status = 'active' AND u.email_verified_at IS NOT NULL)
           + (SELECT COUNT(*) FROM transactions WHERE status = 'pending')
           AS pending_validations`
    );
    const metrics = metricRows[0];
    response.json({
      totalStudents: Number(metrics?.total_students ?? 0),
      totalCompanies: Number(metrics?.total_companies ?? 0),
      approvedProjects: Number(metrics?.approved_projects ?? 0),
      pendingValidations: Number(metrics?.pending_validations ?? 0),
    });
  })
);

adminRouter.get(
  "/companies",
  requireAuth,
  requireRole("admin"),
  asyncRoute(async (request: Request, response: Response) => {
    const { page, pageSize, q, industry } = companyDirectoryQuerySchema.parse(request.query);
    const filters: string[] = [];
    const values: string[] = [];
    if (q) {
      filters.push("(cp.company_name LIKE ? OR u.name LIKE ? OR u.email LIKE ? OR cp.industry LIKE ?)");
      const search = `%${q}%`;
      values.push(search, search, search, search);
    }
    if (industry) {
      filters.push("cp.industry = ?");
      values.push(industry);
    }
    const where = filters.length > 0 ? `WHERE ${filters.join(" AND ")}` : "";
    const [statsRows, industryRows, countRows, companyRows] = await Promise.all([
      rows<RowDataPacket[]>(
        `SELECT COUNT(*) AS total_partners,
                (SELECT COUNT(*) FROM projects WHERE status = 'approved') AS active_projects,
                COALESCE(SUM(cp.verification_status = 'pending'), 0) AS pending_verification,
                COALESCE(SUM(cp.verification_status = 'verified'), 0) AS verified_partners
         FROM company_profiles cp`
      ),
      rows<RowDataPacket[]>(
        `SELECT DISTINCT industry
         FROM company_profiles
         WHERE industry IS NOT NULL AND TRIM(industry) <> ''
         ORDER BY industry`
      ),
      rows<RowDataPacket[]>(
        `SELECT COUNT(*) AS total
         FROM company_profiles cp
         JOIN users u ON u.id = cp.user_id
         ${where}`,
        values
      ),
      rows<CompanyDirectoryRow[]>(
        `SELECT cp.user_id AS id, cp.company_name, cp.industry, cp.website,
                cp.verification_status, u.name AS account_name, u.email,
                cp.logo_file_id,
                COALESCE(project_counts.active_projects, 0) AS active_projects,
                u.created_at
         FROM company_profiles cp
         JOIN users u ON u.id = cp.user_id
         LEFT JOIN (
           SELECT company_id, COUNT(*) AS active_projects
           FROM projects
           WHERE status = 'approved'
           GROUP BY company_id
         ) AS project_counts ON project_counts.company_id = cp.user_id
         ${where}
         ORDER BY u.created_at DESC
         LIMIT ? OFFSET ?`,
        [...values, pageSize, (page - 1) * pageSize]
      ),
    ]);

    const stats = statsRows[0];
    const total = Number(countRows[0]?.total ?? 0);
    response.json({
      companies: companyRows.map((company) => ({
        id: company.id,
        name: company.company_name,
        industry: company.industry,
        website: company.website,
        accountName: company.account_name,
        email: company.email,
        status: company.verification_status,
        logoUrl: company.logo_file_id ? `/api/v1/files/${company.logo_file_id}` : null,
        activeProjects: Number(company.active_projects),
        createdAt: new Date(company.created_at).toISOString(),
      })),
      stats: {
        totalPartners: Number(stats?.total_partners ?? 0),
        activeProjects: Number(stats?.active_projects ?? 0),
        pendingVerification: Number(stats?.pending_verification ?? 0),
        verifiedPartners: Number(stats?.verified_partners ?? 0),
      },
      industries: industryRows.map((row) => String(row.industry)),
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    });
  })
);

adminRouter.get(
  "/validations",
  requireAuth,
  requireRole("admin"),
  asyncRoute(async (request: Request, response: Response) => {
    const { page, pageSize, type } = validationQuerySchema.parse(request.query);
    const where = type === "all" ? "" : "WHERE type = ?";
    const values = type === "all" ? [] : [type];
    const [countRows, validationRows] = await Promise.all([
      rows<RowDataPacket[]>(
        `SELECT COUNT(*) AS total FROM ${pendingValidationsQuery} AS validations ${where}`,
        values
      ),
      rows<ValidationRow[]>(
        `SELECT type, id, label, title, detail, submitter_name, submitter_detail,
                image_file_id, attachment_file_id, amount, method, created_at
         FROM ${pendingValidationsQuery} AS validations
         ${where}
         ORDER BY created_at DESC
         LIMIT ? OFFSET ?`,
        [...values, pageSize, (page - 1) * pageSize]
      ),
    ]);
    const total = Number(countRows[0]?.total ?? 0);

    response.json({
      validations: validationRows.map((item) => ({
        type: item.type,
        id: item.id,
        label: item.label,
        title: item.title,
        detail: item.detail,
        submitterName: item.submitter_name,
        submitterDetail: item.submitter_detail,
        imageUrl: item.image_file_id ? `/api/v1/files/${item.image_file_id}` : null,
        attachmentUrl: item.attachment_file_id ? `/api/v1/files/${item.attachment_file_id}` : null,
        amount: item.amount === null ? null : Number(item.amount),
        method: item.method,
        submittedAt: new Date(item.created_at).toISOString(),
      })),
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    });
  })
);

adminRouter.patch(
  "/validations/:type/:id",
  requireAuth,
  requireRole("admin"),
  asyncRoute(async (request: Request, response: Response) => {
    const type = z.enum(["company", "student"]).parse(request.params.type);
    const { status } = validationReviewSchema.parse(request.body);
    const table = type === "company" ? "company_profiles" : "student_profiles";
    const result = type === "company"
      ? await execute(
          `UPDATE company_profiles
           SET verification_status = ?, verified = ?
           WHERE user_id = ? AND verification_status = 'pending'`,
          [status, status === "verified", request.params.id]
        )
      : await execute(
          `UPDATE student_profiles
           SET verification_status = ?
           WHERE user_id = ? AND verification_status = 'pending'`,
          [status, request.params.id]
        );
    if (!result.affectedRows) {
      throw new ApiError(409, "VALIDATION_ALREADY_REVIEWED", `This ${table === "company_profiles" ? "company" : "student"} validation is no longer pending.`);
    }
    response.json({ status });
  })
);

adminRouter.get(
  "/students/export",
  requireAuth,
  requireRole("admin"),
  asyncRoute(async (request: Request, response: Response) => {
    const { q } = exportQuerySchema.parse(request.query);
    const where = q
      ? "WHERE u.role = 'student' AND (u.name LIKE ? OR u.email LIKE ? OR sp.university LIKE ?)"
      : "WHERE u.role = 'student'";
    const search = `%${q}%`;
    const values = q ? [search, search, search] : [];
    const studentRows = await rows<StudentDirectoryRow[]>(
      `SELECT u.id, u.name, u.email, u.status, u.email_verified_at,
              u.created_at, sp.university
       FROM users u
       JOIN student_profiles sp ON sp.user_id = u.id
       ${where}
       ORDER BY u.created_at DESC`,
      values
    );
    const escapeCsv = (value: string) => `"${value.replace(/"/g, '""')}"`;
    const csv = [
      ["Name", "Email", "University", "Status", "Join Date"].map(escapeCsv).join(","),
      ...studentRows.map((student) => {
        const status = student.status === "suspended"
          ? "FLAGGED"
          : student.status === "active" && student.email_verified_at
            ? "VERIFIED"
            : "PENDING";
        return [
          student.name,
          student.email,
          student.university,
          status,
          new Date(student.created_at).toISOString(),
        ].map(escapeCsv).join(",");
      }),
    ].join("\r\n");
    response.type("text/csv").attachment("InternSpace_Students_Directory.csv").send(csv);
  })
);

adminRouter.get(
  "/students",
  requireAuth,
  requireRole("admin"),
  asyncRoute(async (request: Request, response: Response) => {
    const { page, pageSize, q } = directoryQuerySchema.parse(request.query);
    const search = `%${q}%`;
    const hasSearch = q.length > 0;
    const where = hasSearch
      ? "WHERE u.role = 'student' AND (u.name LIKE ? OR u.email LIKE ? OR sp.university LIKE ?)"
      : "WHERE u.role = 'student'";
    const values = hasSearch ? [search, search, search] : [];
    const [countRows, studentRows] = await Promise.all([
      rows<RowDataPacket[]>(
        `SELECT COUNT(*) AS total
         FROM users u
         JOIN student_profiles sp ON sp.user_id = u.id
         ${where}`,
        values
      ),
      rows<StudentDirectoryRow[]>(
        `SELECT u.id, u.name, u.email, u.status, u.email_verified_at,
                u.created_at, sp.university
         FROM users u
         JOIN student_profiles sp ON sp.user_id = u.id
         ${where}
         ORDER BY u.created_at DESC
         LIMIT ? OFFSET ?`,
        [...values, pageSize, (page - 1) * pageSize]
      ),
    ]);
    const total = Number(countRows[0]?.total ?? 0);

    response.json({
      students: studentRows.map((student) => ({
        id: student.id,
        name: student.name,
        email: student.email,
        university: student.university,
        status: student.status === "suspended"
          ? "FLAGGED"
          : student.status === "active" && student.email_verified_at
            ? "VERIFIED"
            : "PENDING",
        joinedAt: new Date(student.created_at).toISOString(),
      })),
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    });
  })
);

adminRouter.post(
  "/students/invitations",
  requireAuth,
  requireRole("admin"),
  asyncRoute(async (request: Request, response: Response) => {
    const input = inviteSchema.parse(request.body);
    const connection = await beginTransaction();
    const userId = randomUUID();
    const token = newToken();
    const invitationUrl = `${config.APP_URL}/verify-email?token=${encodeURIComponent(token)}&invited=1`;

    try {
      await connection.beginTransaction();
      await connection.execute(
        `INSERT INTO users (id, name, email, password_hash, role, status)
         VALUES (?, ?, ?, NULL, 'student', 'pending')`,
        [userId, input.name, input.email]
      );
      await connection.execute(
        `INSERT INTO student_profiles (user_id, university, major, nim, phone)
         VALUES (?, ?, 'Not provided', NULL, '')`,
        [userId, input.university]
      );
      await connection.execute(
        `INSERT INTO action_tokens (id, user_id, purpose, token_hash, expires_at)
         VALUES (?, ?, 'verify_email', ?, DATE_ADD(NOW(), INTERVAL 24 HOUR))`,
        [randomUUID(), userId, hashToken(token)]
      );
      await sendActionEmail(
        input.email,
        "You are invited to InternSpace — verify your account and set a password",
        invitationUrl
      );
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      if ((error as { code?: string }).code === "ER_DUP_ENTRY") {
        throw new ApiError(409, "EMAIL_IN_USE", "An account with this email already exists.");
      }
      throw error;
    } finally {
      connection.release();
    }

    response.status(201).json({
      message: "Student invitation saved. The student must verify their email, then use Forgot password to set a password.",
    });
  })
);
