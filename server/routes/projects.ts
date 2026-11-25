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
import { normalizeSkillNames, resolveSkillId, skillMatchPercent } from "../skills";

export const projectsRouter = Router();

const projectInputSchema = z.object({
  title: z.string().trim().min(4).max(180),
  category: z.string().trim().min(2).max(100),
  description: z.string().trim().min(30).max(15000),
  durationWeeks: z.coerce.number().int().min(1).max(104),
  location: z.string().trim().min(2).max(120),
  stipend: z.string().trim().max(180).default(""),
  skillsRequired: z.array(z.string().trim().min(1).max(100)).min(1).max(30),
});

interface ProjectRow extends RowDataPacket {
  id: string;
  company_id: string;
  title: string;
  category: string;
  description: string;
  duration_weeks: number;
  location: string;
  stipend: string;
  is_featured: number | boolean;
  status: "pending" | "approved" | "rejected";
  created_at: Date | string;
  company_name: string;
  logo_file_id: string | null;
}

interface ApiProject {
  id: string;
  title: string;
  company: string;
  companyId: string;
  companyLogo?: string;
  category: string;
  description: string;
  skillsRequired: string[];
  duration: string;
  durationWeeks: number;
  location: string;
  stipend: string;
  isFeatured: boolean;
  skillMatchPercent?: number;
  status: ProjectRow["status"];
  createdAt: string;
}

function mapProject(row: ProjectRow, skills: string[]): ApiProject {
  const durationWeeks = Number(row.duration_weeks);
  const duration = durationWeeks % 4 === 0
    ? `${durationWeeks / 4} months`
    : `${durationWeeks} weeks`;
  return {
    id: row.id,
    title: row.title,
    company: row.company_name,
    companyId: row.company_id,
    companyLogo: row.logo_file_id ? `/api/v1/files/${row.logo_file_id}` : undefined,
    category: row.category,
    description: row.description,
    skillsRequired: skills,
    duration,
    durationWeeks,
    location: row.location,
    stipend: row.stipend,
    isFeatured: Boolean(row.is_featured),
    status: row.status,
    createdAt: new Date(row.created_at).toISOString(),
  };
}

async function loadProjectSkills(projectIds: string[]): Promise<Map<string, string[]>> {
  const result = new Map<string, string[]>();
  if (projectIds.length === 0) return result;
  const placeholders = projectIds.map(() => "?").join(", ");
  const skills = await rows<RowDataPacket[]>(
    `SELECT ps.project_id, s.name
     FROM project_skills ps
     JOIN skills s ON s.id = ps.skill_id
     WHERE ps.project_id IN (${placeholders})
     ORDER BY s.name`,
    projectIds
  );
  for (const skill of skills) {
    const projectId = String(skill.project_id);
    result.set(projectId, [...(result.get(projectId) ?? []), String(skill.name)]);
  }
  return result;
}

const selectProjectFields = `
  SELECT p.id, p.company_id, p.title, p.category, p.description,
         p.duration_weeks, p.location, p.stipend, p.is_featured,
         p.status, p.created_at, cp.company_name, cp.logo_file_id
  FROM projects p
  JOIN company_profiles cp ON cp.user_id = p.company_id
`;

async function saveProjectSkills(
  connection: Awaited<ReturnType<typeof beginTransaction>>,
  projectId: string,
  names: string[]
): Promise<void> {
  await connection.execute("DELETE FROM project_skills WHERE project_id = ?", [projectId]);
  for (const name of normalizeSkillNames(names)) {
    const skillId = await resolveSkillId(connection, name);
    await connection.execute(
      "INSERT INTO project_skills (project_id, skill_id) VALUES (?, ?)",
      [projectId, skillId]
    );
  }
}

projectsRouter.get("/", asyncRoute(async (request: Request, response: Response) => {
  const search = typeof request.query.q === "string" ? request.query.q.trim().slice(0, 120) : "";
  const category = typeof request.query.category === "string"
    ? request.query.category.trim().slice(0, 100)
    : "";
  const duration = typeof request.query.duration === "string" ? request.query.duration : "";
  const conditions = ["p.status = 'approved'"];
  const values: (string | number)[] = [];

  if (search) {
    const like = `%${search}%`;
    conditions.push(`(
      p.title LIKE ? OR p.description LIKE ? OR cp.company_name LIKE ?
      OR EXISTS (
        SELECT 1 FROM project_skills ps
        JOIN skills s ON s.id = ps.skill_id
        WHERE ps.project_id = p.id AND s.name LIKE ?
      )
    )`);
    values.push(like, like, like, like);
  }
  if (category && category !== "All") {
    conditions.push("p.category = ?");
    values.push(category);
  }
  if (duration === "2-4 weeks") {
    conditions.push("p.duration_weeks BETWEEN 2 AND 4");
  } else if (duration === "1-2 months") {
    conditions.push("p.duration_weeks BETWEEN 4 AND 8");
  } else if (duration === ">2 months") {
    conditions.push("p.duration_weeks > 8");
  } else if (duration && duration !== "All") {
    throw new ApiError(400, "INVALID_DURATION_FILTER", "The duration filter is not supported.");
  }

  const projectRows = await rows<ProjectRow[]>(
    `${selectProjectFields}
     WHERE ${conditions.join(" AND ")}
     ORDER BY p.is_featured DESC, p.created_at DESC`,
    values
  );
  const skillsByProject = await loadProjectSkills(projectRows.map((project) => project.id));
  response.json({
    projects: projectRows.map((project) =>
      mapProject(project, skillsByProject.get(project.id) ?? [])
    ),
  });
}));

projectsRouter.get(
  "/mine",
  requireAuth,
  requireRole("company"),
  asyncRoute(async (request: Request, response: Response) => {
    const user = getAuthenticatedUser(request);
    const projectRows = await rows<ProjectRow[]>(
      `${selectProjectFields}
       WHERE p.company_id = ?
       ORDER BY p.created_at DESC`,
      [user.id]
    );
    const skillsByProject = await loadProjectSkills(projectRows.map((project) => project.id));
    response.json({
      projects: projectRows.map((project) =>
        mapProject(project, skillsByProject.get(project.id) ?? [])
      ),
    });
  })
);

projectsRouter.get(
  "/recommendations",
  requireAuth,
  requireRole("student"),
  asyncRoute(async (request: Request, response: Response) => {
    const user = getAuthenticatedUser(request);
    const projectRows = await rows<ProjectRow[]>(
      `${selectProjectFields}
       WHERE p.status = 'approved'
       ORDER BY p.is_featured DESC, p.created_at DESC`
    );
    const skillsByProject = await loadProjectSkills(projectRows.map((project) => project.id));
    const candidateRows = await rows<RowDataPacket[]>(
      `SELECT s.name
       FROM student_skills ss JOIN skills s ON s.id = ss.skill_id
       WHERE ss.user_id = ?`,
      [user.id]
    );
    const candidateSkills = candidateRows.map((item) => String(item.name));
    const projects = projectRows.map((project) => {
      const requiredSkills = skillsByProject.get(project.id) ?? [];
      return {
        ...mapProject(project, requiredSkills),
        skillMatchPercent: skillMatchPercent(requiredSkills, candidateSkills),
      };
    });
    response.json({ projects });
  })
);

projectsRouter.post(
  "/",
  requireAuth,
  requireRole("company"),
  asyncRoute(async (request: Request, response: Response) => {
    const input = projectInputSchema.parse(request.body);
    const user = getAuthenticatedUser(request);
    const id = randomUUID();
    const connection = await beginTransaction();

    try {
      await connection.execute(
        `INSERT INTO projects
         (id, company_id, title, category, description, duration_weeks, location, stipend)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          user.id,
          input.title,
          input.category,
          input.description,
          input.durationWeeks,
          input.location,
          input.stipend,
        ]
      );
      await saveProjectSkills(connection, id, input.skillsRequired);
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

    const saved = await rows<ProjectRow[]>(
      `${selectProjectFields} WHERE p.id = ? LIMIT 1`,
      [id]
    );
    const skillsByProject = await loadProjectSkills([id]);
    response.status(201).json({
      project: mapProject(saved[0], skillsByProject.get(id) ?? []),
    });
  })
);

projectsRouter.patch(
  "/:id",
  requireAuth,
  requireRole("company"),
  asyncRoute(async (request: Request, response: Response) => {
    const input = projectInputSchema.parse(request.body);
    const user = getAuthenticatedUser(request);
    const connection = await beginTransaction();

    try {
      const [owned] = await connection.execute<RowDataPacket[]>(
        "SELECT id FROM projects WHERE id = ? AND company_id = ? FOR UPDATE",
        [request.params.id, user.id]
      );
      if (!owned[0]) throw new ApiError(404, "PROJECT_NOT_FOUND", "Project not found.");
      await connection.execute(
        `UPDATE projects
         SET title = ?, category = ?, description = ?, duration_weeks = ?,
             location = ?, stipend = ?, status = 'pending'
         WHERE id = ? AND company_id = ?`,
        [
          input.title,
          input.category,
          input.description,
          input.durationWeeks,
          input.location,
          input.stipend,
          request.params.id,
          user.id,
        ]
      );
      await saveProjectSkills(connection, String(request.params.id), input.skillsRequired);
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

    const [saved] = await rows<ProjectRow[]>(
      `${selectProjectFields} WHERE p.id = ? LIMIT 1`,
      [request.params.id]
    );
    const skillsByProject = await loadProjectSkills([String(request.params.id)]);
    response.json({ project: mapProject(saved, skillsByProject.get(saved.id) ?? []) });
  })
);

projectsRouter.get(
  "/:id/match",
  requireAuth,
  requireRole("student"),
  asyncRoute(async (request: Request, response: Response) => {
    const user = getAuthenticatedUser(request);
    const projects = await rows<RowDataPacket[]>(
      "SELECT id FROM projects WHERE id = ? AND status = 'approved' LIMIT 1",
      [request.params.id]
    );
    if (!projects[0]) throw new ApiError(404, "PROJECT_NOT_FOUND", "Project not found.");
    const [requiredRows, candidateRows] = await Promise.all([
      rows<RowDataPacket[]>(
        `SELECT s.name FROM project_skills ps
         JOIN skills s ON s.id = ps.skill_id
         WHERE ps.project_id = ?`,
        [request.params.id]
      ),
      rows<RowDataPacket[]>(
        `SELECT s.name FROM student_skills ss
         JOIN skills s ON s.id = ss.skill_id
         WHERE ss.user_id = ?`,
        [user.id]
      ),
    ]);
    const required = requiredRows.map((item) => String(item.name));
    const candidate = candidateRows.map((item) => String(item.name));
    response.json({
      matchPercent: skillMatchPercent(required, candidate),
      matchedSkills: required.filter((skill) =>
        candidate.some((item) => item.toLocaleLowerCase("en-US") === skill.toLocaleLowerCase("en-US"))
      ),
    });
  })
);

projectsRouter.get("/:id", asyncRoute(async (request: Request, response: Response) => {
  const projectRows = await rows<ProjectRow[]>(
    `${selectProjectFields}
     WHERE p.id = ? AND p.status = 'approved' LIMIT 1`,
    [request.params.id]
  );
  const project = projectRows[0];
  if (!project) throw new ApiError(404, "PROJECT_NOT_FOUND", "Project not found.");
  const skillsByProject = await loadProjectSkills([project.id]);
  response.json({
    project: mapProject(project, skillsByProject.get(project.id) ?? []),
  });
}));

projectsRouter.get(
  "/admin/pending",
  requireAuth,
  requireRole("admin"),
  asyncRoute(async (_request: Request, response: Response) => {
    const projectRows = await rows<ProjectRow[]>(
      `${selectProjectFields}
       WHERE p.status = 'pending'
       ORDER BY p.created_at ASC`
    );
    const skillsByProject = await loadProjectSkills(projectRows.map((project) => project.id));
    response.json({
      projects: projectRows.map((project) =>
        mapProject(project, skillsByProject.get(project.id) ?? [])
      ),
    });
  })
);

projectsRouter.patch(
  "/:id/approval",
  requireAuth,
  requireRole("admin"),
  asyncRoute(async (request: Request, response: Response) => {
    const { status } = z.object({ status: z.enum(["approved", "rejected"]) }).parse(request.body);
    const result = await execute(
      "UPDATE projects SET status = ? WHERE id = ? AND status = 'pending'",
      [status, request.params.id]
    );
    if (!result.affectedRows) throw new ApiError(409, "PROJECT_NOT_PENDING", "Project is not awaiting review.");
    response.json({ status });
  })
);
