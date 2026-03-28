import express from "express";
import { postController } from "./post.controller.js";
import { verifyUserAuth } from "../../middlewares/verifyUserAuth.js";
// import auth from "../../middlewares/auth.js";


const router = express.Router();

router.post("/", verifyUserAuth, postController.createPost);
router.get("/feed", postController.getFeed);
router.get("/me", verifyUserAuth, postController.getMyPosts);
router.delete("/:postId", verifyUserAuth, postController.deletePost);

export default router;