import express from "express";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import { config } from "./config";
import { errorHandler, ApiError, asyncRoute } from "./errors";
import { pool } from "./db";
import { authRouter } from "./routes/auth";
import { adminRouter } from "./routes/admin";
import { profilesRouter } from "./routes/profiles";
import { projectsRouter } from "./routes/projects";
import { applicationsRouter } from "./routes/applications";
import { transactionsRouter } from "./routes/transactions";
import { filesRouter } from "./uploads";

export const app = express();

app.disable("x-powered-by");
app.set("trust proxy", config.NODE_ENV === "production" ? 1 : false);
app.use(helmet());
app.use(cors({
  origin: config.FRONTEND_ORIGIN,
  credentials: true,
  methods: ["GET", "HEAD", "POST", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
  maxAge: 600,
}));
app.use((request, _response, next) => {
  const isMutation = !["GET", "HEAD", "OPTIONS"].includes(request.method);
  if (isMutation && request.headers.origin && request.headers.origin !== config.FRONTEND_ORIGIN) {
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

app.use((_request, _response, next) => {
  next(new ApiError(404, "NOT_FOUND", "The requested API route was not found."));
});
app.use(errorHandler);

