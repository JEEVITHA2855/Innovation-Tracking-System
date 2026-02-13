const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');
const { authenticate } = require('../middlewares/auth.middleware');

router.use(authenticate);

// GET /api/notifications — Get user's notifications
router.get('/', (req, res, next) => notificationController.getAll(req, res, next));

// GET /api/notifications/unread-count — Get unread count
router.get('/unread-count', (req, res, next) => notificationController.getUnreadCount(req, res, next));

// PUT /api/notifications/read-all — Mark all as read
router.put('/read-all', (req, res, next) => notificationController.markAllAsRead(req, res, next));

// PUT /api/notifications/:id/read — Mark single notification as read
router.put('/:id/read', (req, res, next) => notificationController.markAsRead(req, res, next));

module.exports = router;
