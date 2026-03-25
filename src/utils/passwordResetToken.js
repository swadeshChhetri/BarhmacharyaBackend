// backend/src/utils/passwordResetToken.js
import crypto from "crypto";

export const generatePasswordResetToken = () => {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
  return { rawToken, tokenHash };
};

export const hashPasswordResetToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};
