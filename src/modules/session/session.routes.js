import express from "express";
import * as sessionController from "./session.controller.js";
import { verifyUserAuth } from "../../middlewares/verifyUserAuth.js";
import { isAdmin } from "../../middlewares/isAdmin.js";

const router = express.Router();

// Public/User routes
router.get("/", sessionController.getSessions);
router.get("/:id", sessionController.getSessionById);

// Admin only routes
router.post("/", verifyUserAuth, isAdmin, sessionController.createSession);
router.put("/:id", verifyUserAuth, isAdmin, sessionController.updateSession);
router.delete("/:id", verifyUserAuth, isAdmin, sessionController.deleteSession);

export default router;
