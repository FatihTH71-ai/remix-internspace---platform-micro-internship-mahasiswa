import { randomUUID } from "node:crypto";
import { Router, type Request, type Response } from "express";
import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import { z } from "zod";
import type { RowDataPacket } from "mysql2/promise";
import { config } from "../config";
import { pool, rows, execute } from "../db";
import { ApiError, asyncRoute } from "../errors";
import {
  clearSessionCookie,
  createSession,
  getAuthenticatedUser,
  hashToken,
  newToken,
  requireAuth,
  revokeSession,
  type AuthUser,
  type UserRole,
} from "../auth";
import { emailDeliveryConfigured, sendActionEmail } from "../mailer";

export const authRouter = Router();

const passwordSchema = z.string().min(8).max(72);
const emailSchema = z.string().trim().email().max(254).transform((value) => value.toLowerCase());
const studentRegistrationSchema = z.object({
  role: z.literal("student"),
  name: z.string().trim().min(2).max(160),
  email: emailSchema,
  password: passwordSchema,
  university: z.string().trim().min(2).max(180),
  major: z.string().trim().min(2).max(180),
  nim: z.string().trim().max(80).optional(),
  phone: z.string().trim().min(8).max(40),
});
const companyRegistrationSchema = z.object({
  role: z.literal("company"),
  name: z.string().trim().min(2).max(160),
  email: emailSchema,
  password: passwordSchema,
  companyName: z.string().trim().min(2).max(180),
  industry: z.string().trim().min(2).max(120),
  website: z.string().trim().url().max(2048).optional().or(z.literal("")),
});
const registrationSchema = z.discriminatedUnion("role", [
  studentRegistrationSchema,
  companyRegistrationSchema,
]);

const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(8).max(72),
  role: z.enum(["student", "company", "admin"]).optional(),
});

const tokenSchema = z.object({ token: z.string().min(20).max(200) });
const resetSchema = tokenSchema.extend({ password: passwordSchema });

interface AccountRow extends RowDataPacket {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: "pending" | "active" | "suspended";
  email_verified_at: Date | string | null;
  password_hash: string | null;
  is_premium: number | boolean;
  premium_until: Date | string | null;
  company_name: string | null;
  university: string | null;
  major: string | null;
  phone: string | null;
  portfolio_url: string | null;
}

function publicUser(account: AccountRow): AuthUser {
  const premiumUntil = account.premium_until
    ? new Date(account.premium_until)
    : null;
  return {
    id: account.id,
    name: account.name,
    email: account.email,
    role: account.role,
    companyName: account.company_name ?? undefined,
    university: account.university ?? undefined,
    major: account.major ?? undefined,
    phone: account.phone ?? undefined,
    portfolioUrl: account.portfolio_url ?? undefined,
    isPremium: Boolean(account.is_premium) && Boolean(premiumUntil && premiumUntil > new Date()),
    premiumUntil: premiumUntil?.toISOString() ?? null,
  };
}

async function loadAccount(userId: string): Promise<AccountRow | undefined> {
  const accounts = await rows<AccountRow[]>(
    `SELECT u.id, u.name, u.email, u.role, u.status, u.email_verified_at,
            u.password_hash, u.is_premium, u.premium_until,
            cp.company_name, sp.university, sp.major, sp.phone, sp.portfolio_url
     FROM users u
     LEFT JOIN company_profiles cp ON cp.user_id = u.id
     LEFT JOIN student_profiles sp ON sp.user_id = u.id
     WHERE u.id = ? LIMIT 1`,
    [userId]
  );
  return accounts[0];
}

async function issueActionToken(
  userId: string,
  purpose: "verify_email" | "reset_password",
  lifetimeMinutes: number
): Promise<string> {
  const token = newToken();
  await execute("DELETE FROM action_tokens WHERE user_id = ? AND purpose = ?", [
    userId,
    purpose,
  ]);
  await execute(
    `INSERT INTO action_tokens (id, user_id, purpose, token_hash, expires_at)
     VALUES (?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL ? MINUTE))`,
    [randomUUID(), userId, purpose, hashToken(token), lifetimeMinutes]
  );
  return token;
}

authRouter.post("/register", asyncRoute(async (request, response) => {
  const input = registrationSchema.parse(request.body);
  if (Buffer.byteLength(input.password, "utf8") > 72) {
    throw new ApiError(400, "PASSWORD_TOO_LONG", "Password must be 72 bytes or fewer.");
  }
  const passwordHash = await bcrypt.hash(input.password, 12);
  const userId = randomUUID();
  const connection = await pool.getConnection();
  let token = "";

  try {
    await connection.beginTransaction();
    await connection.execute(
      `INSERT INTO users (id, name, email, password_hash, role, status)
       VALUES (?, ?, ?, ?, ?, 'pending')`,
      [userId, input.name, input.email, passwordHash, input.role]
    );

    if (input.role === "student") {
      await connection.execute(
        `INSERT INTO student_profiles (user_id, university, major, nim, phone)
         VALUES (?, ?, ?, ?, ?)`,
        [userId, input.university, input.major, input.nim || null, input.phone]
      );
    } else {
      await connection.execute(
        `INSERT INTO company_profiles (user_id, company_name, industry, website)
         VALUES (?, ?, ?, ?)`,
        [userId, input.companyName, input.industry, input.website || null]
      );
    }

    token = newToken();
    await connection.execute(
      `INSERT INTO action_tokens (id, user_id, purpose, token_hash, expires_at)
       VALUES (?, ?, 'verify_email', ?, DATE_ADD(NOW(), INTERVAL 24 HOUR))`,
      [randomUUID(), userId, hashToken(token)]
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

  await sendActionEmail(
    input.email,
    "Verify your InternSpace account",
    `${config.APP_URL}/verify-email?token=${encodeURIComponent(token)}`
  );
  response.status(201).json({
    message: "Registration received. Verify your email before signing in.",
  });
}));

authRouter.post("/resend-verification", asyncRoute(async (request, response) => {
  const { email } = z.object({ email: emailSchema }).parse(request.body);
  const accounts = await rows<AccountRow[]>(
    "SELECT id, email, role, status FROM users WHERE email = ? LIMIT 1",
    [email]
  );
  const account = accounts[0];
  if (account && account.status === "pending") {
    const token = await issueActionToken(account.id, "verify_email", 24 * 60);
    await sendActionEmail(
      email,
      "Verify your InternSpace account",
      `${config.APP_URL}/verify-email?token=${encodeURIComponent(token)}`
    );
  }
  response.json({ message: "If the account needs verification, a link has been sent." });
}));

authRouter.post("/verify-email", asyncRoute(async (request, response) => {
  const { token } = tokenSchema.parse(request.body);
  const tokenHash = hashToken(token);
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    const [foundTokens] = await connection.execute<RowDataPacket[]>(
      `SELECT id, user_id FROM action_tokens
       WHERE token_hash = ? AND purpose = 'verify_email'
         AND used_at IS NULL AND expires_at > NOW()
       FOR UPDATE`,
      [tokenHash]
    );
    const action = foundTokens[0];
    if (!action) throw new ApiError(400, "INVALID_TOKEN", "The verification link is invalid or expired.");
    await connection.execute(
      `UPDATE users SET status = 'active', email_verified_at = NOW()
       WHERE id = ? AND status = 'pending'`,
      [String(action.user_id)]
    );
    await connection.execute("UPDATE action_tokens SET used_at = NOW() WHERE id = ?", [
      String(action.id),
    ]);
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }

  response.json({ message: "Email verified. You can now sign in." });
}));

authRouter.post("/login", asyncRoute(async (request, response) => {
  const input = loginSchema.parse(request.body);
  const accounts = await rows<AccountRow[]>(
    `SELECT u.id, u.name, u.email, u.role, u.status, u.email_verified_at,
            u.password_hash, u.is_premium, u.premium_until,
            cp.company_name, sp.university, sp.major, sp.phone, sp.portfolio_url
     FROM users u
     LEFT JOIN company_profiles cp ON cp.user_id = u.id
     LEFT JOIN student_profiles sp ON sp.user_id = u.id
     WHERE u.email = ? LIMIT 1`,
    [input.email]
  );
  const account = accounts[0];
  const passwordMatches = account?.password_hash
    ? await bcrypt.compare(input.password, account.password_hash)
    : false;
  if (!account || !passwordMatches || (input.role && input.role !== account.role)) {
    throw new ApiError(401, "INVALID_CREDENTIALS", "Email or password is incorrect.");
  }
  if (account.status === "pending" || !account.email_verified_at) {
    throw new ApiError(403, "EMAIL_NOT_VERIFIED", "Verify your email before signing in.");
  }
  if (account.status !== "active") {
    throw new ApiError(403, "ACCOUNT_UNAVAILABLE", "This account is not active.");
  }

  await createSession(account.id, response);
  response.json({ user: publicUser(account) });
}));

authRouter.post("/logout", asyncRoute(async (request, response) => {
  await revokeSession(request);
  clearSessionCookie(response);
  response.status(204).end();
}));

authRouter.get("/me", requireAuth, asyncRoute(async (request, response) => {
  const user = getAuthenticatedUser(request);
  response.json({ user });
}));

authRouter.post("/forgot-password", asyncRoute(async (request, response) => {
  const { email } = z.object({ email: emailSchema }).parse(request.body);
  const accounts = await rows<AccountRow[]>(
    "SELECT id, email, status FROM users WHERE email = ? LIMIT 1",
    [email]
  );
  const account = accounts[0];
  let developmentResetUrl: string | undefined;
  if (account && account.status === "active") {
    const token = await issueActionToken(account.id, "reset_password", 30);
    const resetUrl = `${config.APP_URL}/reset-password?token=${encodeURIComponent(token)}`;
    await sendActionEmail(
      email,
      "Reset your InternSpace password",
      resetUrl
    );
    if (config.NODE_ENV === "development" && !emailDeliveryConfigured) {
      developmentResetUrl = resetUrl;
    }
  }
  response.json({
    message: "If an active account matches that email, a reset link has been sent.",
    ...(developmentResetUrl ? { developmentResetUrl } : {}),
  });
}));

authRouter.post("/reset-password", asyncRoute(async (request, response) => {
  const { token, password } = resetSchema.parse(request.body);
  if (Buffer.byteLength(password, "utf8") > 72) {
    throw new ApiError(400, "PASSWORD_TOO_LONG", "Password must be 72 bytes or fewer.");
  }
  const passwordHash = await bcrypt.hash(password, 12);
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    const [foundTokens] = await connection.execute<RowDataPacket[]>(
      `SELECT id, user_id FROM action_tokens
       WHERE token_hash = ? AND purpose = 'reset_password'
         AND used_at IS NULL AND expires_at > NOW()
       FOR UPDATE`,
      [hashToken(token)]
    );
    const action = foundTokens[0];
    if (!action) throw new ApiError(400, "INVALID_TOKEN", "The reset link is invalid or expired.");
    await connection.execute(
      "UPDATE users SET password_hash = ? WHERE id = ? AND status = 'active'",
      [passwordHash, String(action.user_id)]
    );
    await connection.execute("UPDATE action_tokens SET used_at = NOW() WHERE id = ?", [
      String(action.id),
    ]);
    await connection.execute("DELETE FROM sessions WHERE user_id = ?", [
      String(action.user_id),
    ]);
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }

  response.json({ message: "Password updated. Sign in with your new password." });
}));

type OAuthProvider = "google" | "github";

function oauthConfig(provider: OAuthProvider) {
  if (provider === "google") {
    if (!config.GOOGLE_CLIENT_ID || !config.GOOGLE_CLIENT_SECRET) {
      throw new ApiError(503, "OAUTH_UNAVAILABLE", "Google sign-in is not configured.");
    }
    return {
      clientId: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      callbackUrl: config.GOOGLE_CALLBACK_URL,
    };
  }

  if (!config.GITHUB_CLIENT_ID || !config.GITHUB_CLIENT_SECRET) {
    throw new ApiError(503, "OAUTH_UNAVAILABLE", "GitHub sign-in is not configured.");
  }
  return {
    clientId: config.GITHUB_CLIENT_ID,
    clientSecret: config.GITHUB_CLIENT_SECRET,
    callbackUrl: config.GITHUB_CALLBACK_URL,
  };
}

function isOAuthProvider(value: string): value is OAuthProvider {
  return value === "google" || value === "github";
}

authRouter.get("/oauth/:provider", asyncRoute(async (request, response) => {
  const providerName = String(request.params.provider);
  if (!isOAuthProvider(providerName)) {
    throw new ApiError(404, "OAUTH_PROVIDER_NOT_FOUND", "This sign-in provider is not supported.");
  }
  const provider = providerName;
  const role = z.enum(["student", "company"]).parse(request.query.role);
  const credentials = oauthConfig(provider);
  const state = newToken();
  await execute(
    `INSERT INTO oauth_states (token_hash, role, provider, expires_at)
     VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL 10 MINUTE))`,
    [hashToken(state), role, provider]
  );

  if (provider === "google") {
    const client = new OAuth2Client(
      credentials.clientId,
      credentials.clientSecret,
      credentials.callbackUrl
    );
    response.redirect(client.generateAuthUrl({
      access_type: "online",
      scope: ["openid", "email", "profile"],
      state,
      prompt: "select_account",
    }));
    return;
  }

  const query = new URLSearchParams({
    client_id: credentials.clientId,
    redirect_uri: credentials.callbackUrl,
    scope: "read:user user:email",
    state,
  });
  response.redirect(`https://github.com/login/oauth/authorize?${query.toString()}`);
}));

async function resolveOAuthIdentity(
  provider: OAuthProvider,
  code: string,
  callbackUrl: string
): Promise<{ providerUserId: string; email: string; name: string }> {
  const credentials = oauthConfig(provider);

  if (provider === "google") {
    const client = new OAuth2Client(
      credentials.clientId,
      credentials.clientSecret,
      callbackUrl
    );
    const { tokens } = await client.getToken(code);
    if (!tokens.id_token) throw new ApiError(401, "OAUTH_FAILED", "Google did not return an ID token.");
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: credentials.clientId,
    });
    const payload = ticket.getPayload();
    if (!payload?.sub || !payload.email || !payload.email_verified) {
      throw new ApiError(401, "OAUTH_EMAIL_UNVERIFIED", "Google must provide a verified email address.");
    }
    return {
      providerUserId: payload.sub,
      email: payload.email.toLowerCase(),
      name: payload.name?.trim() || payload.email.split("@")[0],
    };
  }

  const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: credentials.clientId,
      client_secret: credentials.clientSecret,
      code,
      redirect_uri: callbackUrl,
    }),
  });
  if (!tokenResponse.ok) throw new ApiError(401, "OAUTH_FAILED", "GitHub sign-in could not be completed.");
  const tokenBody = z.object({ access_token: z.string().min(1) }).parse(await tokenResponse.json());
  const headers = {
    Authorization: `Bearer ${tokenBody.access_token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "InternSpace",
  };
  const [userResponse, emailsResponse] = await Promise.all([
    fetch("https://api.github.com/user", { headers }),
    fetch("https://api.github.com/user/emails", { headers }),
  ]);
  if (!userResponse.ok || !emailsResponse.ok) {
    throw new ApiError(401, "OAUTH_FAILED", "GitHub profile information could not be loaded.");
  }
  const githubUser = z.object({
    id: z.number().int(),
    name: z.string().nullable().optional(),
    login: z.string().min(1),
  }).parse(await userResponse.json());
  const githubEmails = z.array(z.object({
    email: z.string().email(),
    primary: z.boolean(),
    verified: z.boolean(),
  })).parse(await emailsResponse.json());
  const email = githubEmails.find((item) => item.primary && item.verified)?.email
    ?? githubEmails.find((item) => item.verified)?.email;
  if (!email) throw new ApiError(401, "OAUTH_EMAIL_UNVERIFIED", "GitHub must provide a verified email address.");
  return {
    providerUserId: String(githubUser.id),
    email: email.toLowerCase(),
    name: githubUser.name?.trim() || githubUser.login,
  };
}

async function createOrLoadOAuthAccount(
  provider: OAuthProvider,
  identity: { providerUserId: string; email: string; name: string },
  role: "student" | "company"
): Promise<string> {
  const existingAccounts = await rows<RowDataPacket[]>(
    `SELECT u.id
     FROM oauth_accounts oa JOIN users u ON u.id = oa.user_id
     WHERE oa.provider = ? AND oa.provider_user_id = ? AND u.status = 'active'
     LIMIT 1`,
    [provider, identity.providerUserId]
  );
  if (existingAccounts[0]) return String(existingAccounts[0].id);

  const emailAccounts = await rows<RowDataPacket[]>(
    "SELECT id FROM users WHERE email = ? LIMIT 1",
    [identity.email]
  );
  if (emailAccounts[0]) {
    throw new ApiError(
      409,
      "OAUTH_ACCOUNT_LINK_REQUIRED",
      "An account already uses this email. Sign in with its password before linking a provider."
    );
  }

  const userId = randomUUID();
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    await connection.execute(
      `INSERT INTO users (id, name, email, role, status, email_verified_at)
       VALUES (?, ?, ?, ?, 'active', NOW())`,
      [userId, identity.name, identity.email, role]
    );
    if (role === "student") {
      await connection.execute(
        `INSERT INTO student_profiles (user_id, university, major, phone)
         VALUES (?, 'Not provided', 'Not provided', 'Not provided')`,
        [userId]
      );
    } else {
      await connection.execute(
        `INSERT INTO company_profiles (user_id, company_name, industry, verified)
         VALUES (?, ?, 'Not provided', FALSE)`,
        [userId, identity.name]
      );
    }
    await connection.execute(
      `INSERT INTO oauth_accounts (id, user_id, provider, provider_user_id)
       VALUES (?, ?, ?, ?)`,
      [randomUUID(), userId, provider, identity.providerUserId]
    );
    await connection.commit();
    return userId;
  } catch (error) {
    await connection.rollback();
    if ((error as { code?: string }).code === "ER_DUP_ENTRY") {
      const duplicate = await rows<RowDataPacket[]>(
        `SELECT u.id FROM oauth_accounts oa
         JOIN users u ON u.id = oa.user_id
         WHERE oa.provider = ? AND oa.provider_user_id = ? LIMIT 1`,
        [provider, identity.providerUserId]
      );
      if (duplicate[0]) return String(duplicate[0].id);
    }
    throw error;
  } finally {
    connection.release();
  }
}

authRouter.get("/oauth/:provider/callback", asyncRoute(async (request: Request, response: Response) => {
  const providerName = String(request.params.provider);
  if (!isOAuthProvider(providerName)) {
    throw new ApiError(404, "OAUTH_PROVIDER_NOT_FOUND", "This sign-in provider is not supported.");
  }
  const provider = providerName;
  oauthConfig(provider);
  const query = z.object({
    code: z.string().min(1),
    state: z.string().min(20),
  }).parse(request.query);
  const states = await rows<RowDataPacket[]>(
    `SELECT role, provider FROM oauth_states
     WHERE token_hash = ? AND provider = ? AND expires_at > NOW()
     LIMIT 1`,
    [hashToken(query.state), provider]
  );
  const oauthState = states[0];
  if (!oauthState) throw new ApiError(400, "INVALID_OAUTH_STATE", "OAuth state is invalid or expired.");
  await execute("DELETE FROM oauth_states WHERE token_hash = ?", [hashToken(query.state)]);

  const callbackUrl = provider === "google" ? config.GOOGLE_CALLBACK_URL : config.GITHUB_CALLBACK_URL;
  const identity = await resolveOAuthIdentity(provider, query.code, callbackUrl);
  const userId = await createOrLoadOAuthAccount(
    provider,
    identity,
    oauthState.role as "student" | "company"
  );
  const account = await loadAccount(userId);
  if (!account || account.status !== "active") {
    throw new ApiError(403, "ACCOUNT_UNAVAILABLE", "This account is not active.");
  }

  await createSession(userId, response);
  response.redirect(config.APP_URL);
}));

export { publicUser };
