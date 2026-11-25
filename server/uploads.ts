import { randomUUID } from "node:crypto";
import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import multer, { type Multer, type FileFilterCallback } from "multer";
import { fileTypeFromBuffer } from "file-type";
import { Router, type Request, type Response } from "express";
import type { RowDataPacket } from "mysql2/promise";
import { config } from "./config";
import { execute, rows } from "./db";
import { ApiError, asyncRoute } from "./errors";
import { getAuthenticatedUser, requireAuth, requireRole, type AuthUser } from "./auth";

export type UploadPurpose = "resume" | "company_logo" | "payment_proof" | "deliverable";
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const acceptedMimeTypes: Record<UploadPurpose, Set<string>> = {
  resume: new Set([
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/jpeg",
    "image/png",
  ]),
  company_logo: new Set(["image/jpeg", "image/png", "image/webp"]),
  payment_proof: new Set(["application/pdf", "image/jpeg", "image/png"]),
  deliverable: new Set([
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/jpeg",
    "image/png",
    "image/webp",
  ]),
};

interface StoredUpload extends RowDataPacket {
  id: string;
  owner_id: string;
  purpose: UploadPurpose;
  storage_name: string;
  original_name: string;
  mime_type: string;
  size_bytes: number;
}

export const uploadFile: Multer = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE, files: 1 },
  fileFilter: (_request: Request, file: Express.Multer.File, callback: FileFilterCallback) => {
    if (!file.originalname.trim()) {
      callback(new ApiError(400, "INVALID_FILE", "A filename is required."));
      return;
    }
    callback(null, true);
  },
});

export async function storeUpload(
  file: Express.Multer.File,
  ownerId: string,
  purpose: UploadPurpose
): Promise<string> {
  const detected = await fileTypeFromBuffer(file.buffer);
  if (!detected || !acceptedMimeTypes[purpose].has(detected.mime)) {
    throw new ApiError(415, "UNSUPPORTED_FILE_TYPE", "This file type is not allowed.");
  }

  const id = randomUUID();
  const storageName = `${id}.${detected.ext}`;
  const originalName = path.basename(file.originalname)
    .replace(/[\u0000-\u001f\u007f"]/g, "")
    .slice(0, 180) || `upload.${detected.ext}`;

  await mkdir(config.UPLOAD_DIR, { recursive: true });
  const fullPath = path.join(config.UPLOAD_DIR, storageName);
  await writeFile(fullPath, file.buffer, { flag: "wx", mode: 0o600 });

  try {
    await execute(
      `INSERT INTO uploads (id, owner_id, purpose, storage_name, original_name, mime_type, size_bytes)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, ownerId, purpose, storageName, originalName, detected.mime, file.size]
    );
  } catch (error) {
    await unlink(fullPath);
    throw error;
  }

  return id;
}

function isAllowedFileMime(mimeType: string): boolean {
  return Object.values(acceptedMimeTypes).some((types) => types.has(mimeType));
}

async function mayReadUpload(upload: StoredUpload, user: AuthUser): Promise<boolean> {
  if (user.role === "admin" || upload.owner_id === user.id) return true;

  if (user.role !== "company") return false;
  if (upload.purpose === "resume") {
    const access = await rows<RowDataPacket[]>(
      `SELECT 1
       FROM applications a
       JOIN projects p ON p.id = a.project_id
       JOIN student_profiles sp ON sp.user_id = a.student_id
       WHERE p.company_id = ? AND sp.resume_file_id = ?
       LIMIT 1`,
      [user.id, upload.id]
    );
    return access.length > 0;
  }

  if (upload.purpose === "deliverable") {
    const access = await rows<RowDataPacket[]>(
      `SELECT 1
       FROM deliverables d
       JOIN applications a ON a.id = d.application_id
       JOIN projects p ON p.id = a.project_id
       WHERE p.company_id = ? AND d.upload_id = ?
       LIMIT 1`,
      [user.id, upload.id]
    );
    return access.length > 0;
  }

  return false;
}

export const filesRouter = Router();

filesRouter.get("/:id", requireAuth, asyncRoute(async (request: Request, response: Response) => {
    const [file] = await rows<StoredUpload[]>(
      "SELECT * FROM uploads WHERE id = ? LIMIT 1",
      [request.params.id]
    );
    if (!file) throw new ApiError(404, "FILE_NOT_FOUND", "File not found.");
    if (!isAllowedFileMime(file.mime_type)) {
      throw new ApiError(415, "UNSUPPORTED_FILE_TYPE", "This file type cannot be served.");
    }
    if (!await mayReadUpload(file, getAuthenticatedUser(request))) {
      throw new ApiError(403, "FORBIDDEN", "You cannot access this file.");
    }

    const content = await readFile(path.join(config.UPLOAD_DIR, file.storage_name));
    response.setHeader("Content-Type", file.mime_type);
    response.setHeader("Content-Length", content.byteLength);
    response.setHeader("Content-Disposition", `attachment; filename="${file.original_name}"`);
    response.setHeader("Cache-Control", "private, no-store");
    response.send(content);
}));

export const resumeUploadRole = requireRole("student");
export const companyLogoUploadRole = requireRole("company");
export const studentUploadRole = requireRole("student");
