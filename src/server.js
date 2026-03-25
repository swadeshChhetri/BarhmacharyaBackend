import http from "http";
import app from "./app.js";
import env from "./config/env.js";
import { info, error } from "./config/logger.js";
// import { initSocket } from "./core/socket.js";
import { connectDB } from "./bootstrap/db.js";


async function start() {
  try {
    await connectDB(env.mongoUri);
    const server = http.createServer(app);
    // initSocket(server);
    server.listen(env.port, () =>
      info(`Server listening on port ${env.port}`)
    );
  } catch (err) {
    error("Failed to start server", err);
    process.exit(1);
  }
}

start();
