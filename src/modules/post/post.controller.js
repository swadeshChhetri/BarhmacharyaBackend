import { postService } from "./post.service.js";

class PostController {
  createPost = async (req, res) => {

    console.log(
      "Creating post with content:", req.body
    )
    try {
      const post = await postService.createPost({
        userId: req.user._id,
        content: req.body.content,
        videoKey: req.body.videoKey,
        postType: req.body.postType,
      });

      res.status(201).json({ success: true, data: post });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  };

  getFeed = async (req, res) => {
    try {
      const posts = await postService.getFeed({
        limit: Number(req.query.limit) || 20,
        cursor: req.query.cursor,
      });

      res.json({ success: true, data: posts });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

  getMyPosts = async (req, res) => {
    try {
      const posts = await postService.getUserPosts({
        userId: req.user._id,
      });

      res.json({ success: true, data: posts });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

  deletePost = async (req, res) => {
    try {
      await postService.deletePost({
        postId: req.params.postId,
        userId: req.user._id,
      });

      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };
}

export const postController = new PostController();