import { createHash, randomBytes } from "node:crypto";
import type { Request, RequestHandler, Response } from "express";
import { rows, execute } from "./db";
import type { RowDataPacket } from "mysql2/promise";
import { ApiError, asyncRoute } from "./errors";
import { config } from "./config";

export type UserRole = "student" | "company" | "admin";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyName?: string;
  university?: string;
  major?: string;
  phone?: string;
  portfolioUrl?: string;
  isPremium: boolean;
  premiumUntil: string | null;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

const SESSION_COOKIE = "internspace_session";
const SESSION_DAYS = 30;

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function cookieToken(request: Request): string | undefined {
  const cookie = request.headers.cookie
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${SESSION_COOKIE}=`));

  return cookie?.slice(SESSION_COOKIE.length + 1);
}

function setSessionCookie(response: Response, token: string): void {
  const flags = [
    `${SESSION_COOKIE}=${token}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${SESSION_DAYS * 24 * 60 * 60}`,
  ];
  if (config.NODE_ENV === "production") flags.push("Secure");
  response.append("Set-Cookie", flags.join("; "));
}

export function clearSessionCookie(response: Response): void {
  const flags = [
    `${SESSION_COOKIE}=`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    "Max-Age=0",
  ];
  if (config.NODE_ENV === "production") flags.push("Secure");
  response.append("Set-Cookie", flags.join("; "));
}

export async function createSession(userId: string, response: Response): Promise<void> {
  const token = randomBytes(32).toString("base64url");
  const tokenHash = hashToken(token);
  await execute(
    `INSERT INTO sessions (id, user_id, token_hash, expires_at)
     VALUES (UUID(), ?, ?, DATE_ADD(NOW(), INTERVAL ? DAY))`,
    [userId, tokenHash, SESSION_DAYS]
  );
  setSessionCookie(response, token);
}

export async function revokeSession(request: Request): Promise<void> {
  const token = cookieToken(request);
  if (!token) return;
  await execute("DELETE FROM sessions WHERE token_hash = ?", [hashToken(token)]);
}

export function getAuthenticatedUser(request: Request): AuthUser {
  if (!request.user) {
    throw new ApiError(401, "AUTHENTICATION_REQUIRED", "Please sign in to continue.");
  }
  return request.user;
}

export const requireAuth: RequestHandler = asyncRoute(async (request, _response, next) => {
  const token = cookieToken(request);
  if (!token) {
    throw new ApiError(401, "AUTHENTICATION_REQUIRED", "Please sign in to continue.");
  }

  const tokenHash = hashToken(token);
  const foundSessions = await rows<RowDataPacket[]>(
    `SELECT s.id AS session_id, u.id, u.name, u.email, u.role,
            u.is_premium, u.premium_until,
            cp.company_name, sp.university, sp.major, sp.phone, sp.portfolio_url
     FROM sessions s
     JOIN users u ON u.id = s.user_id
     LEFT JOIN company_profiles cp ON cp.user_id = u.id
     LEFT JOIN student_profiles sp ON sp.user_id = u.id
     WHERE s.token_hash = ? AND s.expires_at > NOW() AND u.status = 'active'
       AND u.email_verified_at IS NOT NULL
     LIMIT 1`,
    [tokenHash]
  );
  const session = foundSessions[0];
  if (!session) {
    clearSessionCookie(_response as Response);
    throw new ApiError(401, "SESSION_EXPIRED", "Your session has expired. Please sign in again.");
  }

  const now = new Date();
  const premiumUntil = session.premium_until
    ? new Date(session.premium_until as string | Date)
    : null;
  const isPremium = Boolean(session.is_premium) && Boolean(premiumUntil && premiumUntil > now);
  const user = {
    id: String(session.id),
    name: String(session.name),
    email: String(session.email),
    role: session.role as UserRole,
    companyName: session.company_name ? String(session.company_name) : undefined,
    university: session.university ? String(session.university) : undefined,
    major: session.major ? String(session.major) : undefined,
    phone: session.phone ? String(session.phone) : undefined,
    portfolioUrl: session.portfolio_url ? String(session.portfolio_url) : undefined,
    isPremium,
    premiumUntil: premiumUntil?.toISOString() ?? null,
  } satisfies AuthUser;

  await execute("UPDATE sessions SET last_seen_at = NOW() WHERE id = ?", [
    String(session.session_id),
  ]);
  request.user = user;
  next();
});

export function requireRole(...roles: UserRole[]): RequestHandler {
  return (request, _response, next) => {
    try {
      const user = getAuthenticatedUser(request);
      if (!roles.includes(user.role)) {
        throw new ApiError(403, "FORBIDDEN", "You do not have permission to perform this action.");
      }
      next();
    } catch (error) {
      next(error);
    }
  };
}

export function newToken(): string {
  return randomBytes(32).toString("base64url");
}

export { hashToken };
