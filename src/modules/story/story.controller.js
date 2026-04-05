import { storyService } from "./story.service.js";

export const createStory = async (req, res, next) => {
  try {
    const story = await storyService.createStory(req.body);
    res.status(201).json({
      success: true,
      message: "Story created successfully",
      data: story,
    });
  } catch (error) {
    next(error);
  }
};

export const getActiveStories = async (req, res, next) => {
  try {
    const stories = await storyService.getActiveStories();
    res.status(200).json({
      success: true,
      data: stories,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllStoriesAdmin = async (req, res, next) => {
  try {
    const stories = await storyService.getAllStoriesAdmin();
    res.status(200).json({
      success: true,
      data: stories,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteStory = async (req, res, next) => {
  try {
    await storyService.deleteStory(req.params.id);
    res.status(200).json({
      success: true,
      message: "Story deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const toggleStoryStatus = async (req, res, next) => {
  try {
    const { isActive } = req.body;
    const story = await storyService.toggleStoryStatus(req.params.id, isActive);
    res.status(200).json({
      success: true,
      message: `Story ${isActive ? "activated" : "deactivated"} successfully`,
      data: story,
    });
  } catch (error) {
    next(error);
  }
};
