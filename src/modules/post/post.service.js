import mongoose from "mongoose";
import { postRepository } from "./post.repository.js";

class PostService {
  async createPost({ userId, content, videoKey }) {
    if (!content && !videoKey) {
      throw new Error("Post cannot be empty");
    }

    if (content && content.length > 2000) {
      throw new Error("Content too long");
    }

    const videoUrl = videoKey
      ? `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${videoKey}`
      : null;

    return postRepository.create({
      userId: new mongoose.Types.ObjectId(userId),
      content: content || "",
      videoUrl: videoUrl,
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