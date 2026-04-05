import express from "express";
import { getAllUsers, getUserById, createUser, updateUser, deleteUser, getTopMembers } from "./user.controller.js";
import { verifyUserAuth } from "../../middlewares/verifyUserAuth.js";
import { isAdmin } from "../../middlewares/isAdmin.js";

const router = express.Router();

// Publicly fetch Top Members (or authenticated if you prefer)
router.get("/top-members", getTopMembers);

// Apply verifyUserAuth and isAdmin to all other user management routes
router.use(verifyUserAuth, isAdmin);

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
