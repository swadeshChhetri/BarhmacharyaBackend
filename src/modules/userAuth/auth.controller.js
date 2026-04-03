import { AuthService } from "./auth.service.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { uploadToS3 } from "../../services/s3.service.js";

// Configure multer for local storage (temporarily)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = process.env.NODE_ENV === "production" ? "/tmp" : "uploads/profiles";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

export const uploadProfileImage = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only images (jpeg, jpg, png, webp) are allowed"));
  },
});

export const updateProfile = async (req, res, next) => {
  let tempPath = null;
  try {
    const userId = req.user._id;
    const updateData = {
      fullName: req.body.fullName,
      phone: req.body.phone,
    };

    if (req.file) {
      tempPath = req.file.path;
      const key = `profiles/${userId}-${Date.now()}${path.extname(req.file.originalname)}`;
      
      // Upload to S3
      const s3Url = await uploadToS3(tempPath, key);
      updateData.profileImage = s3Url;
      
      // Clean up local file
      fs.unlinkSync(tempPath);
      tempPath = null;
    }

    const updatedUser = await AuthService.updateProfile(userId, updateData);

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    if (tempPath && fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }
    next(err);
  }
};

export const registerAgent = async (req, res, next) => {
  try {
    const result = await AuthService.registerAgent(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const result = await AuthService.login(req.body);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const setAgentPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    const result = await AuthService.setAgentPassword({ token, password });

    res.status(200).json({
      success: true,
      message: "Password set successfully. Account activated.",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    await AuthService.forgotPassword({ email });

    // Always success (prevent enumeration)
    res.status(200).json({
      success: true,
      message: "If the email exists, a reset link has been sent.",
    });
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    await AuthService.resetPassword({ token, password });

    res.status(200).json({
      success: true,
      message: "Password reset successfully.",
    });
  } catch (err) {
    next(err);
  }
};



export const checkAuth = async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
    token: req.token,
  });
};
