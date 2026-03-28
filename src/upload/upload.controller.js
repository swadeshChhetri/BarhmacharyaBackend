import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "../config/s3.js";
import { generateVideoKey } from "../utils/generateKey.js";

export const getUploadUrl = async (req, res) => {
  try {
    const { fileName, fileType } = req.body;
    console.log("upload body", req.body);
    console.log(
      "Received upload URL request for file:",
      fileName,
      "of type:",
      fileType
    );

    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const key = generateVideoKey({ userId, fileName });

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
      ContentType: fileType,
    });

    const uploadUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 60,
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
