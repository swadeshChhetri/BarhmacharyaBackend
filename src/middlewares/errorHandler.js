import { error as logError } from "../config/logger.js";

export default function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const isProd = process.env.NODE_ENV === "production";

  const errorCode =
    err.code || (statusCode === 403 ? "FORBIDDEN" : "INTERNAL_SERVER_ERROR");


  const message = isProd
    ? statusCode >= 500
      ? "Something went wrong. Please try again later."
      : err.message || "Request failed"
    : err.message;

  // Always log full error internally
  logError({
    message: err.message,
    code: errorCode,
    stack: err.stack,
    path: req.originalUrl,
    method: req.method,
  });

  return res.status(statusCode).json({
    success: false,

    // for new frontend (behavior-based)
    error: errorCode,

    // for existing frontend (human-readable)
    message,
  });
}
