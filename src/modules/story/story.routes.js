import express from "express";
import {
  createStory,
  getActiveStories,
  getAllStoriesAdmin,
  deleteStory,
  toggleStoryStatus,
} from "./story.controller.js";
import { verifyUserAuth } from "../../middlewares/verifyUserAuth.js";
import { isAdmin } from "../../middlewares/isAdmin.js";

const router = express.Router();

// Public route for users to see stories
router.get("/", getActiveStories);

// Admin routes
router.use(verifyUserAuth, isAdmin);
router.post("/", createStory);
router.get("/admin", getAllStoriesAdmin);
router.delete("/:id", deleteStory);
router.patch("/:id/status", toggleStoryStatus);

export default router;
