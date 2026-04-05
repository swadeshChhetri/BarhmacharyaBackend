import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "../config/s3.js";
import { generateVideoKey, generateImageKey, generateStoryKey } from "../utils/generateKey.js";

const generateUrl = async (req, res, keyGenerator) => {
  try {
    const { fileName, fileType } = req.body;
    const userId = req.user?._id;
    
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const key = keyGenerator({ userId, fileName });

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
      ContentType: fileType,
    });

    const uploadUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 300, // 5 minutes
    });

    return res.json({
      uploadUrl,
      key,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to generate upload URL" });
  }
};

export const getUploadUrl = async (req, res) => {
  return generateUrl(req, res, generateVideoKey);
};

export const getImageUploadUrl = async (req, res) => {
  return generateUrl(req, res, generateImageKey);
};

export const getStoryUploadUrl = async (req, res) => {
  return generateUrl(req, res, generateStoryKey);
};
