const ideaRepository = require('../repositories/idea.repository');
const reviewRepository = require('../repositories/review.repository');

/**
 * Report Service — handles analytics and reporting
 */
class ReportService {
  async getAnalytics() {
    try {
      const [ideas, byStatus, byDomain, topRatedIdeas] = await Promise.all([
        ideaRepository.findAll(),
        ideaRepository.countByStatus(),
        ideaRepository.countByDomain(),
        reviewRepository.getTopRatedIdeas(5)
      ]);

      const total = ideas.length;
      const approved = byStatus['Approved'] || 0;
      const rejected = byStatus['Rejected'] || 0;

      return {
        overview: {
          totalIdeas: total,
          approved,
          rejected,
          approvalRate: total > 0 ? Math.round((approved / total) * 100) : 0,
        },
        statusDistribution: [
          { status: 'Submitted', count: byStatus['Submitted'] || 0 },
          { status: 'Under Review', count: byStatus['Under_Review'] || 0 },
          { status: 'Approved', count: approved },
          { status: 'Rejected', count: rejected },
          { status: 'Needs Improvement', count: byStatus['Needs_Improvement'] || 0 },
        ],
        domainDistribution: Object.entries(byDomain).map(([domain, count]) => ({
          domain,
          count
        })),
        topRatedIdeas
      };
    } catch (error) {
      console.error('Error generating analytics:', error);
      throw error;
    }
  }
}

module.exports = new ReportService();