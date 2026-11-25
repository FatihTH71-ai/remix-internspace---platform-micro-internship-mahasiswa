import { randomUUID } from "node:crypto";
import { Router, type Request, type Response } from "express";
import type { RowDataPacket } from "mysql2/promise";
import { z } from "zod";
import { getAuthenticatedUser, requireAuth, requireRole } from "../auth";
import { beginTransaction, execute, rows } from "../db";
import { ApiError, asyncRoute } from "../errors";
import { normalizeSkillNames, resolveSkillId } from "../skills";
import { storeUpload, uploadFile } from "../uploads";

export const profilesRouter = Router();

const studentProfileSchema = z.object({
  university: z.string().trim().min(2).max(180).optional(),
  major: z.string().trim().min(2).max(180).optional(),
  nim: z.string().trim().max(80).nullable().optional(),
  phone: z.string().trim().min(8).max(40).optional(),
  bio: z.string().trim().max(5000).nullable().optional(),
  portfolioUrl: z.string().trim().url().max(2048).nullable().optional(),
  skills: z.array(z.string().trim().min(1).max(100)).max(50).optional(),
});

const companyProfileSchema = z.object({
  companyName: z.string().trim().min(2).max(180).optional(),
  industry: z.string().trim().min(2).max(120).optional(),
  website: z.string().trim().url().max(2048).nullable().optional(),
});

profilesRouter.get("/me", requireAuth, asyncRoute(async (request: Request, response: Response) => {
  const user = getAuthenticatedUser(request);
  if (user.role === "student") {
    const profiles = await rows<RowDataPacket[]>(
      `SELECT sp.university, sp.major, sp.nim, sp.phone, sp.bio, sp.portfolio_url,
              sp.resume_file_id, sp.verification_status
       FROM student_profiles sp WHERE sp.user_id = ? LIMIT 1`,
      [user.id]
    );
    const skills = await rows<RowDataPacket[]>(
      `SELECT s.name FROM student_skills ss
       JOIN skills s ON s.id = ss.skill_id
       WHERE ss.user_id = ? ORDER BY s.name`,
      [user.id]
    );
    response.json({
      user,
      profile: {
        ...profiles[0],
        skills: skills.map((row) => String(row.name)),
      },
    });
    return;
  }

  if (user.role === "company") {
    const profiles = await rows<RowDataPacket[]>(
      `SELECT company_name, industry, website, verified, verification_status, logo_file_id
       FROM company_profiles WHERE user_id = ? LIMIT 1`,
      [user.id]
    );
    response.json({ user, profile: profiles[0] ?? null });
    return;
  }

  response.json({ user, profile: null });
}));

profilesRouter.patch(
  "/student",
  requireAuth,
  requireRole("student"),
  asyncRoute(async (request: Request, response: Response) => {
    const input = studentProfileSchema.parse(request.body);
    const user = getAuthenticatedUser(request);
    const connection = await beginTransaction();

    try {
      await connection.execute(
        `UPDATE student_profiles
         SET university = COALESCE(?, university),
             major = COALESCE(?, major),
             nim = COALESCE(?, nim),
             phone = COALESCE(?, phone),
             bio = COALESCE(?, bio),
             portfolio_url = COALESCE(?, portfolio_url),
             verification_status = 'pending'
         WHERE user_id = ?`,
        [
          input.university ?? null,
          input.major ?? null,
          input.nim === undefined ? null : input.nim,
          input.phone ?? null,
          input.bio === undefined ? null : input.bio,
          input.portfolioUrl === undefined ? null : input.portfolioUrl,
          user.id,
        ]
      );

      if (input.skills) {
        await connection.execute("DELETE FROM student_skills WHERE user_id = ?", [user.id]);
        const skillIds = [];
        for (const name of normalizeSkillNames(input.skills)) {
          skillIds.push(await resolveSkillId(connection, name));
        }
        for (const skillId of skillIds) {
          await connection.execute(
            "INSERT INTO student_skills (user_id, skill_id) VALUES (?, ?)",
            [user.id, skillId]
          );
        }
      }

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      if ((error as { code?: string }).code === "ER_DUP_ENTRY") {
        throw new ApiError(409, "NIM_IN_USE", "This student number is already associated with another account.");
      }
      throw error;
    } finally {
      connection.release();
    }

    response.json({ message: "Student profile updated." });
  })
);

profilesRouter.patch(
  "/company",
  requireAuth,
  requireRole("company"),
  asyncRoute(async (request: Request, response: Response) => {
    const input = companyProfileSchema.parse(request.body);
    const user = getAuthenticatedUser(request);
    await execute(
      `UPDATE company_profiles
       SET company_name = COALESCE(?, company_name),
           industry = COALESCE(?, industry),
           website = COALESCE(?, website),
           verified = FALSE,
           verification_status = 'pending'
       WHERE user_id = ?`,
      [
        input.companyName ?? null,
        input.industry ?? null,
        input.website === undefined ? null : input.website,
        user.id,
      ]
    );
    response.json({ message: "Company profile updated." });
  })
);

profilesRouter.post(
  "/student/resume",
  requireAuth,
  requireRole("student"),
  uploadFile.single("file"),
  asyncRoute(async (request: Request, response: Response) => {
    if (!request.file) throw new ApiError(400, "FILE_REQUIRED", "Choose a resume file to upload.");
    const user = getAuthenticatedUser(request);
    const uploadId = await storeUpload(request.file, user.id, "resume");
    await execute(
      `UPDATE student_profiles
       SET resume_file_id = ?, verification_status = 'pending'
       WHERE user_id = ?`,
      [
        uploadId,
        user.id,
      ]
    );
    response.status(201).json({ fileId: uploadId });
  })
);

profilesRouter.post(
  "/company/logo",
  requireAuth,
  requireRole("company"),
  uploadFile.single("file"),
  asyncRoute(async (request: Request, response: Response) => {
    if (!request.file) throw new ApiError(400, "FILE_REQUIRED", "Choose a company logo to upload.");
    const user = getAuthenticatedUser(request);
    const uploadId = await storeUpload(request.file, user.id, "company_logo");
    await execute(
      `UPDATE company_profiles
       SET logo_file_id = ?, verified = FALSE, verification_status = 'pending'
       WHERE user_id = ?`,
      [uploadId, user.id]
    );
    response.status(201).json({ fileId: uploadId });
  })
);
