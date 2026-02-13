const prisma = require('../config/database');

/**
 * Review Repository — handles all database operations for reviews
 */
class ReviewRepository {
  async create(data) {
    return prisma.review.create({
      data,
      include: {
        reviewer: { select: { id: true, name: true } },
        idea: { select: { id: true, title: true, innovatorId: true } }
      }
    });
  }

  async findByIdeaId(ideaId) {
    return prisma.review.findMany({
      where: { ideaId },
      include: {
        reviewer: { select: { id: true, name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findByReviewerId(reviewerId) {
    return prisma.review.findMany({
      where: { reviewerId },
      include: {
        idea: {
          select: { id: true, title: true, domain: true, status: true,
            innovator: { select: { name: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getTopRatedIdeas(limit = 5) {
    const reviews = await prisma.review.findMany({
      include: {
        idea: {
          select: { id: true, title: true, domain: true, status: true,
            innovator: { select: { name: true } }
          }
        }
      }
    });

    // Calculate average scores and sort
    const ideaScores = {};
    reviews.forEach(r => {
      const avg = (r.innovationScore + r.feasibilityScore + r.impactScore) / 3;
      if (!ideaScores[r.ideaId] || avg > ideaScores[r.ideaId].avgScore) {
        ideaScores[r.ideaId] = {
          ...r.idea,
          avgScore: Math.round(avg * 10) / 10,
          innovationScore: r.innovationScore,
          feasibilityScore: r.feasibilityScore,
          impactScore: r.impactScore,
        };
      }
    });

    return Object.values(ideaScores)
      .sort((a, b) => b.avgScore - a.avgScore)
      .slice(0, limit);
  }
}

module.exports = new ReviewRepository();
