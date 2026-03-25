import express from "express";
import cors from "cors";
import helmet from "helmet";
import { morganMiddleware } from "./config/logger.js";
import env from "./config/env.js";
import routes from "./routes/index.js";
import errorHandler from "./middlewares/errorHandler.js";
import path from "path";
import { fileURLToPath } from "url";
// import debugRoutes from "./routes/debug.routes.js";
// import "./modules/lead/events/lead.events.js";
// import "./modules/payouts/payout.events.js";


const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://leadmanagementportal.s3-website.ap-south-1.amazonaws.com",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morganMiddleware);
// app.use("/uploads", express.static("uploads"));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use(env.apiPrefix, routes);
// app.use("/debug", debugRoutes);

// health-check
app.get("/health", (req, res) => res.json({ status: "ok" }));

// central error handler
app.use(errorHandler);

export default app;
