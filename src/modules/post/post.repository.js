import { PostModel } from "./post.model.js";

class PostRepository {
  create(data) {
    return PostModel.create(data);
  }

  findFeed({ limit, cursor }) {
    const query = {
      deletedAt: null,
      visibility: "PUBLIC",
    };

    if (cursor) {
      query._id = { $lt: cursor };
    }

    return PostModel.find(query)
      .sort({ _id: -1 })
      .limit(limit)
      .lean();
  }

  findByUser({ userId, limit }) {
    return PostModel.find({
      userId,
      deletedAt: null,
    })
      .sort({ _id: -1 })
      .limit(limit)
      .lean();
  }

  softDelete({ postId, userId }) {
    return PostModel.updateOne(
      { _id: postId, userId },
      { deletedAt: new Date() }
    );
  }
}

export const postRepository = new PostRepository();