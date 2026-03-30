import express from "express";
import { generateThumbnailController } from "./video.controller.js";
// import { generateThumbnailController } from "../controllers/video.controller.js";

const router = express.Router();

router.post("/generate-thumbnail", generateThumbnailController);

export default router;