import mongoose from "mongoose";
import { info, error } from "../config/logger.js";

export async function connectDB(mongoUri) {
  try {
    await mongoose.connect(mongoUri);
    info("✅ Connected to MongoDB");
  } catch (err) {
    error("❌ MongoDB connection error", err);
    throw err;
  }
}
