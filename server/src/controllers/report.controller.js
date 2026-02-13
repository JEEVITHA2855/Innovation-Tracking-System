const reportService = require('../services/reportService');

/**
 * Report Controller — handles HTTP requests for analytics/reports
 */
class ReportController {
  async getAnalytics(req, res, next) {
    try {
      const analytics = await reportService.getAnalytics();
      res.json({ success: true, data: analytics });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ReportController();
