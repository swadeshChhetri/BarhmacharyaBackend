import express from "express";
import {
  createNotification,
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "./notification.controller.js";
import { verifyUserAuth } from "../../middlewares/verifyUserAuth.js";
import { isAdmin } from "../../middlewares/isAdmin.js";

const router = express.Router();

// User routes
router.get("/", verifyUserAuth, getMyNotifications);
router.patch("/mark-read/:id", verifyUserAuth, markAsRead);
router.patch("/mark-all-read", verifyUserAuth, markAllAsRead);
router.delete("/:id", verifyUserAuth, deleteNotification);

// Admin routes
router.post("/send", verifyUserAuth, isAdmin, createNotification);

export default router;
