const notificationService = require('../services/notification.service');

/**
 * Notification Controller — handles HTTP requests for notifications
 */
class NotificationController {
  async getAll(req, res, next) {
    try {
      const notifications = await notificationService.getNotifications(req.user.id);
      res.json({ success: true, data: notifications });
    } catch (error) {
      next(error);
    }
  }

  async markAsRead(req, res, next) {
    try {
      await notificationService.markAsRead(parseInt(req.params.id));
      res.json({ success: true, message: 'Notification marked as read' });
    } catch (error) {
      next(error);
    }
  }

  async markAllAsRead(req, res, next) {
    try {
      await notificationService.markAllAsRead(req.user.id);
      res.json({ success: true, message: 'All notifications marked as read' });
    } catch (error) {
      next(error);
    }
  }

  async getUnreadCount(req, res, next) {
    try {
      const count = await notificationService.getUnreadCount(req.user.id);
      res.json({ success: true, data: { count } });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new NotificationController();
