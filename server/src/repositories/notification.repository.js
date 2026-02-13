const prisma = require('../config/database');

/**
 * Notification Repository — handles all database operations for notifications
 */
class NotificationRepository {
  async create(data) {
    return prisma.notification.create({ data });
  }

  async findByUserId(userId) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async markAsRead(id) {
    return prisma.notification.update({
      where: { id },
      data: { isRead: true }
    });
  }

  async markAllAsRead(userId) {
    return prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true }
    });
  }

  async countUnread(userId) {
    return prisma.notification.count({
      where: { userId, isRead: false }
    });
  }
}

module.exports = new NotificationRepository();
