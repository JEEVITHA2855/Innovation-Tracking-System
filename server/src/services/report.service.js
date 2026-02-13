const ideaService = require('../services/idea.service');
const reviewService = require('../services/review.service');

/**
 * Report Service — handles analytics and reporting
 */
class ReportService {
  async getAnalytics() {
    const [stats, topRated] = await Promise.all([
      ideaService.getStats(),
      reviewService.getTopRatedIdeas(5)
    ]);

    return {
      overview: {
        totalIdeas: stats.total,
        submitted: stats.submitted,
        underReview: stats.underReview,
        approved: stats.approved,
        rejected: stats.rejected,
        needsImprovement: stats.needsImprovement,
        approvalRate: stats.total > 0
          ? Math.round((stats.approved / stats.total) * 100)
          : 0
      },
      domainDistribution: Object.entries(stats.byDomain).map(([domain, count]) => ({
        domain,
        count
      })),
      statusDistribution: [
        { status: 'Submitted', count: stats.submitted },
        { status: 'Under Review', count: stats.underReview },
        { status: 'Approved', count: stats.approved },
        { status: 'Rejected', count: stats.rejected },
        { status: 'Needs Improvement', count: stats.needsImprovement },
      ],
      topRatedIdeas: topRated
    };
  }
}

module.exports = new ReportService();
