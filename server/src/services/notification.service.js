const notificationRepository = require('../repositories/notification.repository');

/**
 * Notification Service — handles notification business logic
 */
class NotificationService {
  async getNotifications(userId) {
    return notificationRepository.findByUserId(userId);
  }

  async markAsRead(notificationId) {
    return notificationRepository.markAsRead(notificationId);
  }

  async markAllAsRead(userId) {
    return notificationRepository.markAllAsRead(userId);
  }

  async getUnreadCount(userId) {
    return notificationRepository.countUnread(userId);
  }

  async createNotification(userId, message) {
    return notificationRepository.create({ userId, message });
  }
}

module.exports = new NotificationService();
