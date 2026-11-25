import { randomUUID } from "node:crypto";
import { Router, type Request, type Response } from "express";
import type { RowDataPacket } from "mysql2/promise";
import { z } from "zod";
import {
  getAuthenticatedUser,
  requireAuth,
  requireRole,
} from "../auth";
import { beginTransaction, execute, rows } from "../db";
import { ApiError, asyncRoute } from "../errors";
import { storeUpload, uploadFile } from "../uploads";

export const applicationsRouter = Router();

const submitSchema = z.object({
  projectId: z.string().uuid(),
  semester: z.string().trim().min(1).max(40),
  motivation: z.string().trim().min(30).max(6000),
  relevantExperience: z.string().trim().min(10).max(6000),
  portfolioUrl: z.string().trim().url().max(2048).optional().or(z.literal("")),
  linkedinUrl: z.string().trim().url().max(2048).optional().or(z.literal("")),
}).strict();

interface ApplicationRow extends RowDataPacket {
  id: string;
  project_id: string;
  project_title: string;
  company_name: string;
  company_id: string;
  student_id: string;
  student_name: string;
  student_email: string;
  student_major: string;
  student_university: string;
  student_phone: string;
  semester: string;
  motivation: string;
  experience: string;
  portfolio_url: string | null;
  linkedin_url: string | null;
  status: "submitted" | "reviewing" | "accepted" | "rejected" | "completed";
  created_at: Date | string;
  is_priority?: number | boolean;
  skill_match_percent?: number | null;
}

const applicationSelect = `
  SELECT a.id, a.project_id, p.title AS project_title, cp.company_name,
         p.company_id, a.student_id, u.name AS student_name, u.email AS student_email,
         sp.major AS student_major, sp.university AS student_university,
         sp.phone AS student_phone, a.semester, a.motivation, a.experience,
         a.portfolio_url, a.linkedin_url, a.status, a.created_at
`;

const applicationFrom = `
  FROM applications a
  JOIN projects p ON p.id = a.project_id
  JOIN company_profiles cp ON cp.user_id = p.company_id
  JOIN users u ON u.id = a.student_id
  JOIN student_profiles sp ON sp.user_id = a.student_id
`;

function mapApplication(application: ApplicationRow) {
  return {
    id: application.id,
    projectId: application.project_id,
    projectTitle: application.project_title,
    companyName: application.company_name,
    companyId: application.company_id,
    studentId: application.student_id,
    studentName: application.student_name,
    studentEmail: application.student_email,
    studentMajor: application.student_major,
    studentUniversity: application.student_university,
    phone: application.student_phone,
    semester: application.semester,
    motivation: application.motivation,
    relevantExperience: application.experience,
    portfolioUrl: application.portfolio_url ?? "",
    linkedinUrl: application.linkedin_url ?? "",
    status: application.status,
    submittedAt: new Date(application.created_at).toISOString(),
    deliverables: [] as Array<{
      title: string;
      status: "pending" | "submitted" | "approved";
      submittedAt: string;
      fileUrl: string;
    }>,
    isPriority: Boolean(application.is_priority),
    skillMatchPercent: application.skill_match_percent == null
      ? undefined
      : Number(application.skill_match_percent),
  };
}

async function attachDeliverables(
  applications: ReturnType<typeof mapApplication>[]
): Promise<ReturnType<typeof mapApplication>[]> {
  if (applications.length === 0) return applications;
  const placeholders = applications.map(() => "?").join(", ");
  const deliverables = await rows<RowDataPacket[]>(
    `SELECT d.application_id, d.title, d.status, d.created_at, d.upload_id
     FROM deliverables d
     WHERE d.application_id IN (${placeholders})
     ORDER BY d.created_at ASC`,
    applications.map((application) => application.id)
  );
  const byApplication = new Map<string, Array<{
    title: string;
    status: "pending" | "submitted" | "approved";
    submittedAt: string;
    fileUrl: string;
  }>>();
  for (const deliverable of deliverables) {
    const applicationId = String(deliverable.application_id);
    const entries = byApplication.get(applicationId) ?? [];
    entries.push({
      title: String(deliverable.title),
      status: deliverable.status as "pending" | "submitted" | "approved",
      submittedAt: new Date(deliverable.created_at as Date | string).toISOString(),
      fileUrl: `/api/v1/files/${String(deliverable.upload_id)}`,
    });
    byApplication.set(applicationId, entries);
  }
  return applications.map((application) => ({
    ...application,
    deliverables: byApplication.get(application.id) ?? [],
  }));
}

applicationsRouter.post(
  "/",
  requireAuth,
  requireRole("student"),
  asyncRoute(async (request: Request, response: Response) => {
    const input = submitSchema.parse(request.body);
    const user = getAuthenticatedUser(request);
    const connection = await beginTransaction();
    const applicationId = randomUUID();

    try {
      const [lockedUsers] = await connection.execute<RowDataPacket[]>(
        `SELECT id, is_premium, premium_until, status, email_verified_at
         FROM users WHERE id = ? FOR UPDATE`,
        [user.id]
      );
      const student = lockedUsers[0];
      if (!student || student.status !== "active" || !student.email_verified_at) {
        throw new ApiError(403, "ACCOUNT_UNAVAILABLE", "An active verified account is required.");
      }

      const [projectRows] = await connection.execute<RowDataPacket[]>(
        "SELECT id FROM projects WHERE id = ? AND status = 'approved' LIMIT 1",
        [input.projectId]
      );
      if (!projectRows[0]) {
        throw new ApiError(404, "PROJECT_NOT_FOUND", "This project is not available.");
      }

      const [duplicates] = await connection.execute<RowDataPacket[]>(
        "SELECT id FROM applications WHERE project_id = ? AND student_id = ? LIMIT 1",
        [input.projectId, user.id]
      );
      if (duplicates[0]) {
        throw new ApiError(409, "APPLICATION_EXISTS", "You have already applied to this project.");
      }

      const premiumUntil = student.premium_until
        ? new Date(student.premium_until as Date | string)
        : null;
      const isPremium = Boolean(student.is_premium)
        && Boolean(premiumUntil && premiumUntil > new Date());

      if (!isPremium) {
        const [activeApplications] = await connection.execute<RowDataPacket[]>(
          `SELECT COUNT(*) AS count
           FROM applications
           WHERE student_id = ?
             AND status IN ('submitted', 'reviewing', 'accepted')`,
          [user.id]
        );
        if (Number(activeApplications[0]?.count ?? 0) >= 3) {
          throw new ApiError(
            409,
            "FREE_APPLICATION_LIMIT",
            "Free accounts can have up to three active applications."
          );
        }
      }

      await connection.execute(
        `INSERT INTO applications
         (id, project_id, student_id, semester, motivation, experience, portfolio_url, linkedin_url)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          applicationId,
          input.projectId,
          user.id,
          input.semester,
          input.motivation,
          input.relevantExperience,
          input.portfolioUrl || null,
          input.linkedinUrl || null,
        ]
      );
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      if ((error as { code?: string }).code === "ER_DUP_ENTRY") {
        throw new ApiError(409, "APPLICATION_EXISTS", "You have already applied to this project.");
      }
      throw error;
    } finally {
      connection.release();
    }

    const [saved] = await rows<ApplicationRow[]>(
      `${applicationSelect}${applicationFrom} WHERE a.id = ? LIMIT 1`,
      [applicationId]
    );
    response.status(201).json({ application: mapApplication(saved) });
  })
);

applicationsRouter.get(
  "/mine",
  requireAuth,
  requireRole("student"),
  asyncRoute(async (request: Request, response: Response) => {
    const user = getAuthenticatedUser(request);
    const applications = await rows<ApplicationRow[]>(
      `${applicationSelect}${applicationFrom}
       WHERE a.student_id = ?
       ORDER BY a.created_at DESC`,
      [user.id]
    );
    response.json({ applications: await attachDeliverables(applications.map(mapApplication)) });
  })
);

applicationsRouter.get(
  "/company",
  requireAuth,
  requireRole("company"),
  asyncRoute(async (request: Request, response: Response) => {
    const user = getAuthenticatedUser(request);
    const applications = await rows<ApplicationRow[]>(
      `${applicationSelect},
       CASE WHEN u.is_premium = 1 AND u.premium_until > NOW() THEN 1 ELSE 0 END AS is_priority,
       CASE
         WHEN (SELECT COUNT(*) FROM project_skills psc WHERE psc.project_id = a.project_id) = 0 THEN 100
         ELSE (
           SELECT ROUND(
             100 * COUNT(DISTINCT matched.skill_id)
             / (SELECT COUNT(*) FROM project_skills required WHERE required.project_id = a.project_id)
           )
           FROM project_skills matched
           JOIN student_skills student_match
             ON student_match.skill_id = matched.skill_id AND student_match.user_id = a.student_id
           WHERE matched.project_id = a.project_id
         )
       END AS skill_match_percent
       ${applicationFrom}
       WHERE p.company_id = ?
       ORDER BY is_priority DESC, skill_match_percent DESC, a.created_at ASC`,
      [user.id]
    );
    response.json({ applications: await attachDeliverables(applications.map(mapApplication)) });
  })
);

applicationsRouter.patch(
  "/:id/status",
  requireAuth,
  requireRole("company"),
  asyncRoute(async (request: Request, response: Response) => {
    const user = getAuthenticatedUser(request);
    const { status } = z.object({
      status: z.enum(["reviewing", "accepted", "rejected"]),
    }).parse(request.body);
    const result = await execute(
      `UPDATE applications a
       JOIN projects p ON p.id = a.project_id
       SET a.status = ?
       WHERE a.id = ? AND p.company_id = ?
         AND a.status IN ('submitted', 'reviewing')`,
      [status, request.params.id, user.id]
    );
    if (!result.affectedRows) {
      throw new ApiError(404, "APPLICATION_NOT_FOUND", "Application not found or no longer editable.");
    }
    response.json({ status });
  })
);

applicationsRouter.post(
  "/:id/deliverables",
  requireAuth,
  requireRole("student"),
  uploadFile.single("file"),
  asyncRoute(async (request: Request, response: Response) => {
    if (!request.file) throw new ApiError(400, "FILE_REQUIRED", "Choose a deliverable to upload.");
    const user = getAuthenticatedUser(request);
    const { title } = z.object({
      title: z.string().trim().min(2).max(180),
    }).parse(request.body);
    const applications = await rows<RowDataPacket[]>(
      `SELECT id FROM applications
       WHERE id = ? AND student_id = ? AND status = 'accepted'
       LIMIT 1`,
      [request.params.id, user.id]
    );
    if (!applications[0]) {
      throw new ApiError(404, "APPLICATION_NOT_FOUND", "An accepted application was not found.");
    }
    const uploadId = await storeUpload(request.file, user.id, "deliverable");
    const deliverableId = randomUUID();
    await execute(
      `INSERT INTO deliverables (id, application_id, upload_id, title, status)
       VALUES (?, ?, ?, ?, 'submitted')`,
      [deliverableId, request.params.id, uploadId, title]
    );
    response.status(201).json({ id: deliverableId, fileId: uploadId, status: "submitted" });
  })
);
