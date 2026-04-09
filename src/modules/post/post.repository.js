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
    const query = { _id: postId };
    if (userId) {
      query.userId = userId;
    }
    return PostModel.updateOne(
      query,
      { deletedAt: new Date() }
    );
  }

  findAll({ limit, cursor }) {
    const query = {
      deletedAt: null,
    };

    if (cursor) {
      query._id = { $lt: cursor };
    }

    return PostModel.find(query)
      .populate("userId", "fullName email profileImage")
      .sort({ _id: -1 })
      .limit(limit)
      .lean();
  }
}

export const postRepository = new PostRepository();