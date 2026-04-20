import express from "express";
import * as fundController from "./fund.controller.js";
import { verifyUserAuth } from "../../middlewares/verifyUserAuth.js";
import { isAdmin } from "../../middlewares/isAdmin.js";

const router = express.Router();

// User Routes
router.post("/apply", verifyUserAuth, fundController.submitApplication);
router.get("/my-applications", verifyUserAuth, fundController.getUserApplications);
router.get("/stats", verifyUserAuth, fundController.getFundStats);

// Admin Routes
router.get("/applications", verifyUserAuth, isAdmin, fundController.getAllApplications);
router.patch("/applications/:appId", verifyUserAuth, isAdmin, fundController.updateApplicationStatus);
router.delete("/applications/:appId", verifyUserAuth, isAdmin, fundController.deleteApplication);
router.patch("/pool", verifyUserAuth, isAdmin, fundController.updateFundPool);

export default router;
