import dotenv from "dotenv";

// Load .env variables
dotenv.config();

// Validate required environment variables
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI environment variable is required");
}

const env = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpires: process.env.JWT_EXPIRES || "7d",
  jwtAccessExpires: process.env.JWT_ACCESS_EXPIRES || "8h",
  apiPrefix: process.env.API_PREFIX,
};

export default env;
