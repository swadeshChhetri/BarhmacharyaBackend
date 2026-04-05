import { storyRepository } from "./story.repository.js";
import { downloadVideo } from "../../utils/download.util.js";
import { generateThumbnail } from "../../services/ffmpeg.service.js";
import { uploadToS3 } from "../../services/s3.service.js";
import fs from "fs";
import path from "path";
import os from "os";

class StoryService {
  async createStory({ title, content, mediaKey, mediaType, expiryHours }) {
    if (!mediaKey) {
      throw new Error("Media is required for a story");
    }

    const mediaUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${mediaKey}`;
    let thumbnailUrl = null;

    if (mediaType === "VIDEO") {
      try {
        const tempDir = os.tmpdir();
        const videoPath = path.join(tempDir, `story-video-${Date.now()}.mp4`);
        const thumbName = `story-thumb-${Date.now()}.jpg`;
        const thumbPath = path.join(tempDir, thumbName);

        await downloadVideo(mediaUrl, videoPath);
        await generateThumbnail(videoPath, thumbPath);

        const thumbKey = `stories/thumbnails/${thumbName}`;
        thumbnailUrl = await uploadToS3(thumbPath, thumbKey);

        if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
        if (fs.existsSync(thumbPath)) fs.unlinkSync(thumbPath);
      } catch (err) {
        console.error("❌ Story thumbnail generation failed:", err);
      }
    }

    let expiryDate = null;
    if (expiryHours) {
      expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + parseInt(expiryHours));
    }

    return await storyRepository.create({
      title,
      content,
      mediaUrl,
      mediaType,
      thumbnailUrl,
      expiryDate,
    });
  }

  async getAllStoriesAdmin() {
    return await storyRepository.findAllAdmin();
  }

  async getActiveStories() {
    return await storyRepository.findActive();
  }

  async deleteStory(id) {
    return await storyRepository.softDelete(id);
  }

  async toggleStoryStatus(id, isActive) {
    return await storyRepository.toggleActive(id, isActive);
  }
}

export const storyService = new StoryService();
