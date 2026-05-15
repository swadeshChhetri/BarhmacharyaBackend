import express from "express";
import * as membershipController from "./membership.controller.js";
import { verifyUserAuth } from "../../middlewares/verifyUserAuth.js";
import { isAdmin } from "../../middlewares/isAdmin.js";

const router = express.Router();

router.post("/submit", verifyUserAuth, membershipController.submitRequest);
router.get("/all", verifyUserAuth, isAdmin, membershipController.getAllRequests);
router.patch("/status/:requestId", verifyUserAuth, isAdmin, membershipController.updateRequestStatus);

export default router;
