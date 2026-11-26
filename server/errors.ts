import type {
  ErrorRequestHandler,
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from "express";
import { ZodError } from "zod";

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const databaseConnectionErrorCodes = new Set([
  "ER_ACCESS_DENIED_ERROR",
  "ER_DBACCESS_DENIED_ERROR",
  "ECONNREFUSED",
  "ETIMEDOUT",
  "PROTOCOL_CONNECTION_LOST",
]);

export function isDatabaseConnectionError(error: unknown): boolean {
  return Boolean(
    error &&
    typeof error === "object" &&
    "code" in error &&
    typeof error.code === "string" &&
    databaseConnectionErrorCodes.has(error.code)
  );
}

export function databaseConnectionErrorMessage(error: unknown): string {
  if (
    error &&
    typeof error === "object" &&
    "code" in error &&
    (error.code === "ER_ACCESS_DENIED_ERROR" || error.code === "ER_DBACCESS_DENIED_ERROR")
  ) {
    return "MySQL rejected the configured database account. Verify MYSQL_USER and MYSQL_PASSWORD, and grant this account access to MYSQL_DATABASE.";
  }
  return "The database connection failed. Check MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWORD, and MYSQL_DATABASE in .env, then restart the API.";
}

export function asyncRoute(
  handler: (request: Request, response: Response, next: NextFunction) => Promise<void> | void
): RequestHandler {
  return (request, response, next) => {
    Promise.resolve(handler(request, response, next)).catch(next);
  };
}

export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  if (error instanceof ApiError) {
    response.status(error.status).json({
      error: { code: error.code, message: error.message },
    });
    return;
  }

  if (error instanceof ZodError) {
    response.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Request validation failed.",
        details: error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      },
    });
    return;
  }

  if (error?.name === "MulterError") {
    const status = error.code === "LIMIT_FILE_SIZE" ? 413 : 400;
    response.status(status).json({
      error: {
        code: error.code === "LIMIT_FILE_SIZE" ? "FILE_TOO_LARGE" : "INVALID_UPLOAD",
        message: error.code === "LIMIT_FILE_SIZE"
          ? "Files must be 5 MB or smaller."
          : "The uploaded file could not be accepted.",
      },
    });
    return;
  }

  if (isDatabaseConnectionError(error)) {
    response.status(503).json({
      error: {
        code: "DATABASE_UNAVAILABLE",
        message: databaseConnectionErrorMessage(error),
      },
    });
    return;
  }

  console.error("Unhandled API error:", error);
  response.status(500).json({
    error: { code: "INTERNAL_ERROR", message: "An unexpected server error occurred." },
  });
};
