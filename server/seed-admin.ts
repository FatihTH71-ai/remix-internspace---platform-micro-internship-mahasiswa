import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { closePool, execute, rows } from "./db";
import type { RowDataPacket } from "mysql2/promise";

const bootstrapSchema = z.object({
  ADMIN_BOOTSTRAP_EMAIL: z.string().email().transform((value) => value.toLowerCase()),
  ADMIN_BOOTSTRAP_NAME: z.string().trim().min(2).max(160),
  ADMIN_BOOTSTRAP_PASSWORD: z.string().min(8).max(72),
});

interface ExistingAdmin extends RowDataPacket {
  id: string;
  role: string;
}

async function seedAdmin(): Promise<void> {
  const input = bootstrapSchema.parse(process.env);
  const existing = await rows<ExistingAdmin[]>(
    "SELECT id, role FROM users WHERE email = ? LIMIT 1",
    [input.ADMIN_BOOTSTRAP_EMAIL]
  );
  if (existing[0]) {
    if (existing[0].role !== "admin") {
      throw new Error("The bootstrap email already belongs to a non-admin account.");
    }
    console.info("An admin account with this email already exists; no changes made.");
    return;
  }

  const passwordHash = await bcrypt.hash(input.ADMIN_BOOTSTRAP_PASSWORD, 12);
  await execute(
    `INSERT INTO users (id, name, email, password_hash, role, status, email_verified_at)
     VALUES (?, ?, ?, ?, 'admin', 'active', NOW())`,
    [randomUUID(), input.ADMIN_BOOTSTRAP_NAME, input.ADMIN_BOOTSTRAP_EMAIL, passwordHash]
  );
  console.info(`Created initial admin account for ${input.ADMIN_BOOTSTRAP_EMAIL}.`);
}

void seedAdmin()
  .catch((error: unknown) => {
    console.error("Admin bootstrap failed:", error);
    process.exitCode = 1;
  })
  .finally(closePool);
