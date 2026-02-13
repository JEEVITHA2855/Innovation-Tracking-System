const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

router.use(authenticate);

// GET /api/reports/analytics — Get analytics data (Admin)
router.get('/analytics', authorize('admin'), (req, res, next) => reportController.getAnalytics(req, res, next));

module.exports = router;
