import NotificationService from "./notification.service.js";

export const createNotification = async (req, res, next) => {
  try {
    const { userId, title, message, type } = req.body;
    
    let result;
    if (userId === "all") {
      result = await NotificationService.broadcastNotification({
        title,
        message,
        type
      });
    } else {
      result = await NotificationService.createNotification({
        userId,
        title,
        message,
        type
      });
    }

    res.status(201).json({
      success: true,
      message: userId === "all" ? "Broadcast sent successfully" : "Notification sent successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const getMyNotifications = async (req, res, next) => {
  try {
    const userId = req.user._id; // Assuming verifyUserAuth sets req.user
    const notifications = await NotificationService.getUserNotifications(userId);
    res.status(200).json({
      success: true,
      data: notifications
    });
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const notificationId = req.params.id;
    const notification = await NotificationService.markAsRead(notificationId, userId);
    
    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
      data: notification
    });
  } catch (error) {
    next(error);
  }
};

export const markAllAsRead = async (req, res, next) => {
  try {
    const userId = req.user._id;
    await NotificationService.markAllAsRead(userId);
    res.status(200).json({
      success: true,
      message: "All notifications marked as read"
    });
  } catch (error) {
    next(error);
  }
};

export const deleteNotification = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const notificationId = req.params.id;
    await NotificationService.deleteNotification(notificationId, userId);
    res.status(200).json({
      success: true,
      message: "Notification deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};
