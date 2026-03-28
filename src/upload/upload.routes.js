import express from "express";
// import { getUploadUrl } from "../controllers/upload.controller.js";
import { validateVideoUpload } from "../middlewares/validateUpload.js";
import { getUploadUrl } from './upload.controller.js';
import { verifyUserAuth } from "../middlewares/verifyUserAuth.js";

const router = express.Router();

router.post("/video", verifyUserAuth, validateVideoUpload, getUploadUrl);

export default router;