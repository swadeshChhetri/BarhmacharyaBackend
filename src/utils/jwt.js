import jwt from "jsonwebtoken";
import env from "../config/env.js";

/**
 * ============================
 * ACCESS TOKEN
 * ============================
 */

export const signAccessToken = (payload) => {
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtAccessExpires || "15m",
  });
};

export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, env.jwtSecret);
  } catch (err) {
    throw new Error("Invalid or expired access token");
  }
};

/**
 * ============================
 * REFRESH TOKEN (optional but ready)
 * ============================
 */

export const signRefreshToken = (payload) => {
  return jwt.sign(payload, env.jwtRefreshSecret, {
    expiresIn: env.jwtRefreshExpires || "7d",
  });
};

export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, env.jwtRefreshSecret);
  } catch (err) {
    throw new Error("Invalid or expired refresh token");
  }
};
