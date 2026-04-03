import express from "express";
import { registerAgent, loginUser, checkAuth, setAgentPassword, forgotPassword, resetPassword, updateProfile, uploadProfileImage } from "./auth.controller.js";
import { verifyUserAuth } from "./../../middlewares/verifyUserAuth.js";
import { authLimiter } from './../../middlewares/rateLimitMiddleware.js';


const router = express.Router();

router.post("/register", authLimiter, registerAgent);
router.post("/login", authLimiter, loginUser);
router.post("/set-password", authLimiter, setAgentPassword);
router.get("/check-auth", verifyUserAuth, checkAuth);

router.patch("/update-profile", verifyUserAuth, uploadProfileImage.single("profileImage"), updateProfile);

// user reset flow
router.post("/forgot-password", authLimiter, forgotPassword);
router.post("/reset-password", authLimiter, resetPassword);


export default router;
