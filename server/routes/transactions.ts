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

export const transactionsRouter = Router();

const plans = {
  student_premium: { role: "student", amount: 35000, label: "InternSpace Student Premium" },
  company_premium: { role: "company", amount: 400000, label: "InternSpace Company Premium" },
} as const;

const createSchema = z.object({
  plan: z.enum(["student_premium", "company_premium"]),
  method: z.enum(["bank_transfer", "ewallet"]),
}).strict();

transactionsRouter.get("/plans", asyncRoute(async (_request, response) => {
  response.json({
    plans: Object.entries(plans).map(([id, plan]) => ({
      id,
      name: plan.label,
      amount: plan.amount,
      role: plan.role,
    })),
  });
}));

interface TransactionRow extends RowDataPacket {
  id: string;
  user_id: string;
  plan: keyof typeof plans;
  amount: number;
  method: "bank_transfer" | "ewallet";
  proof_file_id: string | null;
  status: "pending" | "verified" | "rejected";
  created_at: Date | string;
  verified_at?: Date | string | null;
  user_name?: string;
  user_email?: string;
}

function mapTransaction(transaction: TransactionRow) {
  return {
    id: transaction.id,
    plan: transaction.plan,
    planName: plans[transaction.plan]?.label ?? transaction.plan,
    amount: Number(transaction.amount),
    method: transaction.method,
    proofFileId: transaction.proof_file_id,
    proofUrl: transaction.proof_file_id
      ? `/api/v1/files/${transaction.proof_file_id}`
      : null,
    status: transaction.status,
    createdAt: new Date(transaction.created_at).toISOString(),
    verifiedAt: transaction.verified_at
      ? new Date(transaction.verified_at).toISOString()
      : null,
    userName: transaction.user_name,
    userEmail: transaction.user_email,
  };
}

transactionsRouter.post(
  "/",
  requireAuth,
  asyncRoute(async (request: Request, response: Response) => {
    const input = createSchema.parse(request.body);
    const user = getAuthenticatedUser(request);
    const plan = plans[input.plan];
    if (user.role !== plan.role) {
      throw new ApiError(403, "PLAN_NOT_AVAILABLE", "This plan is not available for your account type.");
    }

    const id = randomUUID();
    await execute(
      `INSERT INTO transactions (id, user_id, plan, amount, method, status)
       VALUES (?, ?, ?, ?, ?, 'pending')`,
      [id, user.id, input.plan, plan.amount, input.method]
    );
    response.status(201).json({
      transaction: {
        id,
        plan: input.plan,
        planName: plan.label,
        amount: plan.amount,
        method: input.method,
        status: "pending",
      },
    });
  })
);

transactionsRouter.post(
  "/:id/proof",
  requireAuth,
  uploadFile.single("file"),
  asyncRoute(async (request: Request, response: Response) => {
    if (!request.file) throw new ApiError(400, "FILE_REQUIRED", "Choose a payment proof file to upload.");
    const user = getAuthenticatedUser(request);
    const transactions = await rows<TransactionRow[]>(
      `SELECT id, user_id, plan, amount, method, proof_file_id, status, created_at
       FROM transactions WHERE id = ? AND user_id = ? LIMIT 1`,
      [request.params.id, user.id]
    );
    const transaction = transactions[0];
    if (!transaction) throw new ApiError(404, "TRANSACTION_NOT_FOUND", "Transaction not found.");
    if (transaction.status !== "pending") {
      throw new ApiError(409, "TRANSACTION_NOT_PENDING", "This transaction can no longer be changed.");
    }
    const fileId = await storeUpload(request.file, user.id, "payment_proof");
    await execute(
      `UPDATE transactions SET proof_file_id = ?
       WHERE id = ? AND user_id = ? AND status = 'pending'`,
      [fileId, transaction.id, user.id]
    );
    response.status(201).json({ proofFileId: fileId, status: "pending" });
  })
);

transactionsRouter.get(
  "/mine",
  requireAuth,
  asyncRoute(async (request: Request, response: Response) => {
    const user = getAuthenticatedUser(request);
    const transactions = await rows<TransactionRow[]>(
      `SELECT id, user_id, plan, amount, method, proof_file_id, status, created_at, verified_at
       FROM transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT 50`,
      [user.id]
    );
    response.json({ transactions: transactions.map(mapTransaction) });
  })
);

transactionsRouter.get(
  "/admin",
  requireAuth,
  requireRole("admin"),
  asyncRoute(async (request: Request, response: Response) => {
    const status = typeof request.query.status === "string" ? request.query.status : "pending";
    if (!["pending", "verified", "rejected", "all"].includes(status)) {
      throw new ApiError(400, "INVALID_STATUS", "The requested transaction status is not supported.");
    }
    const statusWhere = status === "all" ? "" : "WHERE t.status = ?";
    const values = status === "all" ? [] : [status];
    const transactions = await rows<TransactionRow[]>(
      `SELECT t.id, t.user_id, t.plan, t.amount, t.method, t.proof_file_id,
              t.status, t.created_at, t.verified_at, u.name AS user_name,
              u.email AS user_email
       FROM transactions t
       JOIN users u ON u.id = t.user_id
       ${statusWhere}
       ORDER BY CASE WHEN t.status = 'pending' THEN 0 ELSE 1 END, t.created_at ASC
       LIMIT 200`,
      values
    );
    response.json({ transactions: transactions.map(mapTransaction) });
  })
);

transactionsRouter.patch(
  "/:id/review",
  requireAuth,
  requireRole("admin"),
  asyncRoute(async (request: Request, response: Response) => {
    const user = getAuthenticatedUser(request);
    const { status } = z.object({ status: z.enum(["verified", "rejected"]) }).parse(request.body);
    const connection = await beginTransaction();

    try {
      const [transactionRows] = await connection.execute<RowDataPacket[]>(
        `SELECT id, user_id, plan, status, proof_file_id
         FROM transactions WHERE id = ? FOR UPDATE`,
        [request.params.id]
      );
      const transaction = transactionRows[0];
      if (!transaction) throw new ApiError(404, "TRANSACTION_NOT_FOUND", "Transaction not found.");
      if (transaction.status !== "pending") {
        throw new ApiError(409, "TRANSACTION_ALREADY_REVIEWED", "This transaction has already been reviewed.");
      }
      if (status === "verified" && !transaction.proof_file_id) {
        throw new ApiError(409, "PAYMENT_PROOF_REQUIRED", "Upload proof before verifying this transaction.");
      }

      await connection.execute(
        `UPDATE transactions
         SET status = ?, verified_by = ?, verified_at = NOW()
         WHERE id = ? AND status = 'pending'`,
        [status, user.id, String(transaction.id)]
      );

      if (status === "verified") {
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
      }

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

    response.json({ id: request.params.id, status });
  })
);
