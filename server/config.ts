import "dotenv/config";
import path from "node:path";
import { z } from "zod";

const optionalNonEmpty = z.preprocess(
  (value) => value === "" ? undefined : value,
  z.string().trim().min(1).optional()
);
const optionalEmail = z.preprocess(
  (value) => value === "" ? undefined : value,
  z.string().email().optional()
);

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(3001),
  FRONTEND_ORIGIN: z.string().url().default("http://localhost:3000"),
  APP_URL: z.string().url().default("http://localhost:3000"),
  MYSQL_HOST: z.string().trim().min(1).default("127.0.0.1"),
  MYSQL_PORT: z.coerce.number().int().min(1).max(65535).default(3306),
  MYSQL_USER: z.string().trim().min(1).default("internspace"),
  MYSQL_PASSWORD: z.string().default(""),
  MYSQL_DATABASE: z.string().trim().min(1).default("internspace"),
  UPLOAD_DIR: optionalNonEmpty,
  SMTP_HOST: optionalNonEmpty,
  SMTP_PORT: z.coerce.number().int().min(1).max(65535).default(587),
  SMTP_USER: optionalNonEmpty,
  SMTP_PASSWORD: optionalNonEmpty,
  SMTP_FROM: optionalEmail,
  GOOGLE_CLIENT_ID: optionalNonEmpty,
  GOOGLE_CLIENT_SECRET: optionalNonEmpty,
  GOOGLE_CALLBACK_URL: z.string().url().default("http://localhost:3001/api/v1/auth/oauth/google/callback"),
  GITHUB_CLIENT_ID: optionalNonEmpty,
  GITHUB_CLIENT_SECRET: optionalNonEmpty,
  GITHUB_CALLBACK_URL: z.string().url().default("http://localhost:3001/api/v1/auth/oauth/github/callback"),
});

const parsed = envSchema.parse(process.env);

export const config = {
  ...parsed,
  UPLOAD_DIR: path.resolve(parsed.UPLOAD_DIR ?? path.join(process.cwd(), ".private_uploads")),
};
