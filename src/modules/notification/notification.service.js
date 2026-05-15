import Notification from "./notification.model.js";

class NotificationService {
  async createNotification(data) {
    return await Notification.create(data);
  }

  async broadcastNotification(data) {
    const User = (await import("../user/user.model.js")).default;
    const users = await User.find({}, "_id");
    const notifications = users.map((user) => ({
      ...data,
      userId: user._id,
    }));
    return await Notification.insertMany(notifications);
  }

  async getUserNotifications(userId) {
    return await Notification.find({ userId }).sort({ createdAt: -1 });
  }

  async markAsRead(notificationId, userId) {
    return await Notification.findOneAndUpdate(
      { _id: notificationId, userId },
      { read: true },
      { new: true }
    );
  }

  async markAllAsRead(userId) {
    return await Notification.updateMany({ userId, read: false }, { read: true });
  }

  async deleteNotification(notificationId, userId) {
    return await Notification.findOneAndDelete({ _id: notificationId, userId });
  }
  
  async deleteOldNotifications(days = 30) {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return await Notification.deleteMany({ createdAt: { $lt: date } });
  }
}

export default new NotificationService();
