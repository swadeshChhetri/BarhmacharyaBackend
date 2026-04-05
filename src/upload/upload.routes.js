import express from "express";
import { validateVideoUpload, validateImageUpload, validateStoryUpload } from "../middlewares/validateUpload.js";
import { getUploadUrl, getImageUploadUrl, getStoryUploadUrl } from './upload.controller.js';
import { verifyUserAuth } from "../middlewares/verifyUserAuth.js";

const router = express.Router();

router.post("/video", verifyUserAuth, validateVideoUpload, getUploadUrl);
router.post("/image", verifyUserAuth, validateImageUpload, getImageUploadUrl);
router.post("/story", verifyUserAuth, validateStoryUpload, getStoryUploadUrl);

export default router;