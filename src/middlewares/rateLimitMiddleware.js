import rateLimit from "express-rate-limit";

/**
 * Strict limiter for auth routes (login / register)
 */
export const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5, // 5 requests per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many attempts. Please try again after a minute."
  }
});
