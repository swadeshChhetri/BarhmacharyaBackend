import { StoryModel } from "./story.model.js";

class StoryRepository {
  async create(data) {
    const story = new StoryModel(data);
    return await story.save();
  }

  async findAllAdmin() {
    return await StoryModel.find({ isDeleted: false }).sort({ createdAt: -1 });
  }

  async findActive() {
    return await StoryModel.find({ 
      isDeleted: false, 
      isActive: true,
      $or: [
        { expiryDate: null },
        { expiryDate: { $gt: new Date() } }
      ]
    }).sort({ createdAt: -1 });
  }

  async softDelete(id) {
    return await StoryModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
  }

  async toggleActive(id, isActive) {
    return await StoryModel.findByIdAndUpdate(id, { isActive }, { new: true });
  }
}

export const storyRepository = new StoryRepository();
