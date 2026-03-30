import mongoose from "mongoose";
import { postRepository } from "./post.repository.js";
import { downloadVideo } from "../../utils/download.util.js";
import { generateThumbnail } from "../../services/ffmpeg.service.js";
import { uploadToS3 } from "../../services/s3.service.js";
import fs from "fs";
import path from "path";
import os from "os";

class PostService {
  async createPost({ userId, content, videoKey, postType }) {
    if (!content && !videoKey) {
      throw new Error("Post cannot be empty");
    }

    if (content && content.length > 2000) {
      throw new Error("Content too long");
    }

    let videoUrl = null;
    let thumbnailUrl = null;

    if (videoKey) {
      videoUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${videoKey}`;

      console.log("🎬 Video detected. Generating thumbnail for:", videoUrl);

      // 👉 Step 3: Generate Thumbnail (Server-side)
      try {
        const tempDir = os.tmpdir();
        const videoPath = path.join(tempDir, `video-${Date.now()}.mp4`);
        const thumbName = `thumb-${Date.now()}.jpg`;
        const thumbPath = path.join(tempDir, thumbName);

        console.log("📥 Downloading video to:", videoPath);
        // 1. Download video
        await downloadVideo(videoUrl, videoPath);

        console.log("🎞️ Generating thumbnail at:", thumbPath);
        // 2. Generate thumbnail
        await generateThumbnail(videoPath, thumbPath);

        console.log("📤 Uploading thumbnail to S3...");
        // 3. Upload thumbnail to S3
        const thumbKey = `thumbnails/${userId}/${thumbName}`;
        thumbnailUrl = await uploadToS3(thumbPath, thumbKey);
        console.log("✅ Thumbnail uploaded:", thumbnailUrl);

        // 4. Cleanup
        if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
        if (fs.existsSync(thumbPath)) fs.unlinkSync(thumbPath);
      } catch (err) {
        console.error("❌ Thumbnail generation failed:", err);
        // We continue anyway, so the post is still created.
      }
    }

    return postRepository.create({
      userId: new mongoose.Types.ObjectId(userId),
      content: content || "",
      videoUrl: videoUrl,
      thumbnailUrl: thumbnailUrl,
      postType: postType || "POST",
    });
  }

  getFeed({ limit = 20, cursor }) {
    return postRepository.findFeed({ limit, cursor });
  }

  getUserPosts({ userId, limit = 20 }) {
    return postRepository.findByUser({ userId, limit });
  }

  deletePost({ postId, userId }) {
    return postRepository.softDelete({ postId, userId });
  }
}

export const postService = new PostService();