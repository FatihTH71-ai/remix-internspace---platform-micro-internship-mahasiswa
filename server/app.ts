import express from "express";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import { config } from "./config";
import { errorHandler, ApiError, asyncRoute } from "./errors";
import { getAllowedFrontendOrigins, isAllowedFrontendOrigin } from "./origins";
import { getMidtransHttpStatus, validateMidtransCredentials } from "./midtrans";
import { pool } from "./db";
import { authRouter } from "./routes/auth";
import { adminRouter } from "./routes/admin";
import { profilesRouter } from "./routes/profiles";
import { projectsRouter } from "./routes/projects";
import { applicationsRouter } from "./routes/applications";
import { plans, transactionsRouter } from "./routes/transactions";
import { filesRouter } from "./uploads";

// ===== MIDTRANS: import tambahan =====
import { createHash, randomUUID, timingSafeEqual } from "node:crypto";
import type { RowDataPacket } from "mysql2/promise";
import { z } from "zod";
// @ts-ignore -- midtrans-client tidak selalu punya type bawaan
import midtransClient from "midtrans-client";
import { getAuthenticatedUser, requireAuth } from "./auth";
import { beginTransaction, execute } from "./db";
// ===== AKHIR MIDTRANS: import tambahan =====

export const app = express();
const allowedFrontendOrigins = getAllowedFrontendOrigins(
  config.FRONTEND_ORIGIN,
  config.NODE_ENV
);

app.disable("x-powered-by");
app.set("trust proxy", config.NODE_ENV === "production" ? 1 : false);
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "connect-src": ["'self'", "https://api.sandbox.midtrans.com", "https://api.midtrans.com"],
      "frame-src": ["'self'", "https://app.sandbox.midtrans.com", "https://app.midtrans.com"],
      "img-src": ["'self'", "data:", "https://*.midtrans.com"],
      "script-src": ["'self'", "https://app.sandbox.midtrans.com", "https://app.midtrans.com"],
    },
  },
}));
app.use(cors({
  origin: (origin, callback) => {
    callback(null, !origin || isAllowedFrontendOrigin(origin, allowedFrontendOrigins));
  },
  credentials: true,
  methods: ["GET", "HEAD", "POST", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
  maxAge: 600,
}));
app.use((request, _response, next) => {
  const isMutation = !["GET", "HEAD", "OPTIONS"].includes(request.method);
  if (isMutation && request.headers.origin && !isAllowedFrontendOrigin(request.headers.origin, allowedFrontendOrigins)) {
    next(new ApiError(403, "ORIGIN_NOT_ALLOWED", "This origin is not allowed to modify data."));
    return;
  }
  next();
});
app.use(express.json({ limit: "256kb" }));

const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    error: { code: "RATE_LIMITED", message: "Too many authentication attempts. Try again later." },
  },
});

app.get("/api/v1/health", asyncRoute(async (_request, response) => {
  await pool.query("SELECT 1");
  response.json({ status: "ok" });
}));

app.use("/api/v1/auth", authRateLimit, authRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/profiles", profilesRouter);
app.use("/api/v1/projects", projectsRouter);
app.use("/api/v1/applications", applicationsRouter);
app.use("/api/v1/transactions", transactionsRouter);
app.use("/api/v1/files", filesRouter);

// ===== MIDTRANS: Snap token + webhook (tambahan) =====
// Env yang dibutuhkan di .env:
//   MIDTRANS_SERVER_KEY, MIDTRANS_CLIENT_KEY, MIDTRANS_IS_PRODUCTION (opsional, default false)
// Harga paket HARUS sama dengan `plans` di routes/transactions.ts.
const midtransPlans = plans;

const midtransTokenSchema = z.object({
  plan: z.enum(Object.keys(midtransPlans) as [keyof typeof midtransPlans, ...(keyof typeof midtransPlans)[]]),
}).strict();

function midtransKeys() {
  return validateMidtransCredentials(
    process.env.MIDTRANS_SERVER_KEY,
    process.env.MIDTRANS_CLIENT_KEY,
    process.env.MIDTRANS_IS_PRODUCTION === "true"
  );
}

function createSnap() {
  const { serverKey, clientKey } = midtransKeys();
  return new midtransClient.Snap({
    isProduction: process.env.MIDTRANS_IS_PRODUCTION === "true",
    serverKey,
    clientKey,
  });
}

// Dibuat saat pertama dipakai, supaya server tetap bisa jalan tanpa key Midtrans.
let snapClient: ReturnType<typeof createSnap> | undefined;
function getSnap() {
  snapClient ??= createSnap();
  return snapClient;
}

const paymentRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    error: { code: "RATE_LIMITED", message: "Too many payment attempts. Try again later." },
  },
});

// Buat transaksi -> kembalikan snap token.
// Harga diambil dari server, bukan dari client. order_id Midtrans = transactions.id.
app.post(
  "/api/v1/payments/midtrans/token",
  paymentRateLimit,
  requireAuth,
  asyncRoute(async (request, response) => {
    const { plan: planId } = midtransTokenSchema.parse(request.body);
    const user = getAuthenticatedUser(request);
    const plan = midtransPlans[planId];
    if (user.role !== plan.role) {
      throw new ApiError(403, "PLAN_NOT_AVAILABLE", "This plan is not available for your account type.");
    }

    const { clientKey } = midtransKeys();
    const orderId = randomUUID();
    await execute(
      `INSERT INTO transactions (id, user_id, plan, amount, method, status)
       VALUES (?, ?, ?, ?, 'ewallet', 'pending')`,
      [orderId, user.id, planId, plan.amount]
    );

    try {
      const midtransTransaction = await getSnap().createTransaction({
        transaction_details: { order_id: orderId, gross_amount: plan.amount },
        item_details: [{ id: planId, price: plan.amount, quantity: 1, name: plan.label }],
        customer_details: { first_name: user.name, email: user.email },
      });
      const snapJsUrl = new URL(
        process.env.MIDTRANS_IS_PRODUCTION === "true"
          ? "https://app.midtrans.com/snap/snap.js"
          : "https://app.sandbox.midtrans.com/snap/snap.js"
      );
      snapJsUrl.searchParams.set("client-key", clientKey);
      response.status(201).json({
        token: midtransTransaction.token,
        orderId,
        amount: plan.amount,
        snapJsUrl: snapJsUrl.toString(),
      });
    } catch (error) {
      await execute(
        "UPDATE transactions SET status = 'rejected' WHERE id = ? AND status = 'pending'",
        [orderId]
      );
      const status = getMidtransHttpStatus(error);
      if (status === 401) {
        throw new ApiError(
          502,
          "MIDTRANS_UNAUTHORIZED",
          "Midtrans rejected the configured server key. Verify it in the matching sandbox or production dashboard and replace it if it was exposed."
        );
      }
      throw new ApiError(
        502,
        "MIDTRANS_CHECKOUT_FAILED",
        "Midtrans could not create the checkout. Verify your Midtrans configuration and try again."
      );
    }
  })
);

interface MidtransNotification {
  order_id?: string;
  status_code?: string;
  gross_amount?: string;
  signature_key?: string;
  transaction_status?: string;
  fraud_status?: string;
}

// Webhook dari Midtrans (tanpa login; keabsahan dicek lewat signature).
app.post(
  "/api/v1/payments/midtrans/notification",
  asyncRoute(async (request, response) => {
    const { serverKey } = midtransKeys();
    const n = (request.body ?? {}) as MidtransNotification;
    if (!n.order_id || !n.status_code || !n.gross_amount || !n.signature_key) {
      throw new ApiError(400, "INVALID_NOTIFICATION", "Notification payload is incomplete.");
    }

    const expected = createHash("sha512")
      .update(`${n.order_id}${n.status_code}${n.gross_amount}${serverKey}`)
      .digest("hex");
    const provided = Buffer.from(String(n.signature_key));
    const expectedBuffer = Buffer.from(expected);
    if (provided.length !== expectedBuffer.length || !timingSafeEqual(provided, expectedBuffer)) {
      throw new ApiError(403, "INVALID_SIGNATURE", "Notification signature is not valid.");
    }

    const paid =
      n.transaction_status === "settlement" ||
      (n.transaction_status === "capture" && n.fraud_status === "accept");
    const failed = ["cancel", "deny", "expire"].includes(n.transaction_status ?? "");

    if (!paid && !failed) {
      // pending / challenge: belum ada perubahan status
      response.status(200).json({ ok: true });
      return;
    }

    const connection = await beginTransaction();
    try {
      const [transactionRows] = await connection.execute<RowDataPacket[]>(
        `SELECT id, user_id, amount, status
         FROM transactions WHERE id = ? FOR UPDATE`,
        [n.order_id]
      );
      const transaction = transactionRows[0];

      // Order tidak dikenal atau sudah diproses: balas 200 agar Midtrans tidak mengulang kiriman.
      if (!transaction || transaction.status !== "pending") {
        await connection.commit();
        response.status(200).json({ ok: true, ignored: true });
        return;
      }

      if (paid && Number(n.gross_amount) !== Number(transaction.amount)) {
        throw new ApiError(400, "AMOUNT_MISMATCH", "Paid amount does not match the transaction.");
      }

      if (paid) {
        await connection.execute(
          `UPDATE transactions
           SET status = 'verified', verified_at = NOW()
           WHERE id = ? AND status = 'pending'`,
          [String(transaction.id)]
        );
        await connection.execute(
          `UPDATE users
           SET is_premium = TRUE,
               premium_until = DATE_ADD(
                 GREATEST(COALESCE(premium_until, NOW()), NOW()),
                 INTERVAL 1 MONTH
               )
           WHERE id = ?`,
          [String(transaction.user_id)]
        );
      } else {
        await connection.execute(
          `UPDATE transactions SET status = 'rejected'
           WHERE id = ? AND status = 'pending'`,
          [String(transaction.id)]
        );
      }

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

    response.status(200).json({ ok: true });
  })
);
// ===== AKHIR MIDTRANS: Snap token + webhook =====

app.use((_request, _response, next) => {
  next(new ApiError(404, "NOT_FOUND", "The requested API route was not found."));
});
app.use(errorHandler);
