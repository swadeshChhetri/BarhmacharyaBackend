import express from "express";
import { postController } from "./post.controller.js";
import { verifyUserAuth } from "../../middlewares/verifyUserAuth.js";
import { isAdmin } from "../../middlewares/isAdmin.js";
// import auth from "../../middlewares/auth.js";


const router = express.Router();

router.post("/", verifyUserAuth, postController.createPost);
router.get("/feed", postController.getFeed);
router.get("/me", verifyUserAuth, postController.getMyPosts);
router.delete("/:postId", verifyUserAuth, postController.deletePost);

// Admin Routes
router.get("/admin/all", verifyUserAuth, isAdmin, postController.getAllPostsForAdmin);
router.delete("/admin/:postId", verifyUserAuth, isAdmin, postController.adminDeletePost);

export default router;