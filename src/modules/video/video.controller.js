import path from "path";
import fs from "fs";
// import { downloadVideo } from "../utils/download.util.js";
// import { generateThumbnail } from "../../services/ffmpeg.service.js";
import { uploadToS3 } from "../../services/s3.service.js";
import { generateThumbnail } from "../../services/ffmpeg.service.js";
// import { uploadToS3 } from "../../services/s3.service.js";

export const generateThumbnailController = async (req, res) => {
  try {
    const { videoUrl } = req.body;

    if (!videoUrl) {
      return res.status(400).json({ error: "videoUrl required" });
    }

    // temp paths (Render supports /tmp)
    const videoPath = `/tmp/video-${Date.now()}.mp4`;
    const thumbPath = `/tmp/thumb-${Date.now()}.jpg`;

    // 1. Download video
    await downloadVideo(videoUrl, videoPath);

    // 2. Generate thumbnail
    await generateThumbnail(videoPath, thumbPath);

    // 3. Upload thumbnail to S3
    const key = `thumbnails/thumb-${Date.now()}.jpg`;
    const thumbnailUrl = await uploadToS3(thumbPath, key);

    // 4. Cleanup
    fs.unlinkSync(videoPath);
    fs.unlinkSync(thumbPath);

    return res.json({ thumbnailUrl });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Thumbnail generation failed" });
  }
};