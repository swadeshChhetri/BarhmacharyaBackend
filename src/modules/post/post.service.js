import mongoose from "mongoose";
import { postRepository } from "./post.repository.js";
import { PostModel } from "./post.model.js";
import User from "../user/user.model.js";
import { downloadVideo } from "../../utils/download.util.js";
import { generateThumbnail } from "../../services/ffmpeg.service.js";
import { uploadToS3 } from "../../services/s3.service.js";
import fs from "fs";
import path from "path";
import os from "os";

class PostService {
  async createPost({ userId, content, videoKey, postType, startChallenge }) {
    if (!content && !videoKey) {
      throw new Error("Post cannot be empty");
    }

    if (content && content.length > 2000) {
      throw new Error("Content too long");
    }

    let videoUrl = null;
    let thumbnailUrl = null;
    let day = null;

    // Handle Challenge Progress
    if (startChallenge) {
      const user = await User.findById(userId);
      if (user) {
        day = user.currentDay;
        
        // Check if user already has a post for this day to avoid double counting
        const existingPost = await PostModel.findOne({ userId, day, deletedAt: null });
        
        if (!existingPost) {
          // Update user progress only if no post exists for this day
          await User.findByIdAndUpdate(userId, {
            $addToSet: { completedDays: day },
            $inc: { currentDay: 1, coins: 1 }
          });
        }
      }
    }

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
      day: day,
    });
  }

  getFeed({ limit = 20, cursor }) {
    return postRepository.findFeed({ limit, cursor });
  }

  getUserPosts({ userId, limit = 20 }) {
    return postRepository.findByUser({ userId, limit });
  }

  async deletePost({ postId, userId }) {
    const post = await PostModel.findOne({ _id: postId, userId, deletedAt: null });
    if (!post) throw new Error("Post not found");

    const result = await postRepository.softDelete({ postId, userId });
    
    if (post.day !== null && post.day !== undefined) {
      await this._reverseChallengeProgress(post.userId, post.day);
    }

    return result;
  }

  getAllPosts({ limit = 20, cursor }) {
    return postRepository.findAll({ limit, cursor });
  }

  async adminDeletePost({ postId }) {
    const post = await PostModel.findOne({ _id: postId, deletedAt: null });
    if (!post) throw new Error("Post not found");

    const result = await postRepository.softDelete({ postId });

    if (post.day !== null && post.day !== undefined) {
      await this._reverseChallengeProgress(post.userId, post.day);
    }

    return result;
  }

  async _reverseChallengeProgress(userId, day) {
    // 0. Check if there are other posts for this day (that are not soft-deleted)
    const otherPosts = await PostModel.findOne({
      userId,
      day,
      deletedAt: null
    });

    // If another post exists for the same day, don't reverse the progress
    if (otherPosts) return;

    // 1. Remove day from completedDays and decrement coins
    await User.findByIdAndUpdate(userId, {
      $pull: { completedDays: day },
      $inc: { coins: -1 }
    });

    // 2. Ensure coins don't go negative
    await User.updateOne(
      { _id: userId, coins: { $lt: 0 } },
      { $set: { coins: 0 } }
    );

    // 3. Recalculate currentDay based on the new completedDays set
    const updatedUser = await User.findById(userId);
    if (updatedUser) {
      const completed = new Set(updatedUser.completedDays);
      let nextDay = 1;
      while (completed.has(nextDay)) {
        nextDay++;
      }
      await User.findByIdAndUpdate(userId, { currentDay: nextDay });
    }
  }
}

export const postService = new PostService();