import express from "express";
import * as orderController from "./order.controller.js";
import { verifyUserAuth } from "../../middlewares/verifyUserAuth.js";
import { isAdmin } from "../../middlewares/isAdmin.js";

const router = express.Router();

// User routes
router.post("/", verifyUserAuth, orderController.handleCreateOrder);
router.get("/", verifyUserAuth, orderController.handleGetUserOrders);
router.get("/:id", verifyUserAuth, orderController.handleGetOrderById);

// Admin routes
router.get("/admin/all", verifyUserAuth, isAdmin, orderController.handleGetAllOrders);
router.patch("/admin/:id", verifyUserAuth, isAdmin, orderController.handleUpdateOrderStatus);

export default router;
