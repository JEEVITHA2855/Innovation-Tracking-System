const prisma = require('../config/database');

/**
 * Idea Repository — handles all database operations for ideas
 */
class IdeaRepository {
  async findAll() {
    return prisma.idea.findMany({
      include: {
        innovator: { select: { id: true, name: true, email: true } },
        reviewer: { select: { id: true, name: true, email: true } },
        reviews: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findById(id) {
    return prisma.idea.findUnique({
      where: { id },
      include: {
        innovator: { select: { id: true, name: true, email: true } },
        reviewer: { select: { id: true, name: true, email: true } },
        reviews: {
          include: { reviewer: { select: { id: true, name: true } } }
        }
      }
    });
  }

  async findByInnovatorId(innovatorId) {
    return prisma.idea.findMany({
      where: { innovatorId },
      include: {
        reviewer: { select: { id: true, name: true } },
        reviews: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findByReviewerId(reviewerId) {
    return prisma.idea.findMany({
      where: { reviewerId },
      include: {
        innovator: { select: { id: true, name: true } },
        reviews: {
          where: { reviewerId },
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async create(data) {
    return prisma.idea.create({
      data,
      include: {
        innovator: { select: { id: true, name: true, email: true } }
      }
    });
  }

  async updateStatus(id, status) {
    return prisma.idea.update({
      where: { id },
      data: { status },
      include: {
        innovator: { select: { id: true, name: true } },
        reviewer: { select: { id: true, name: true } }
      }
    });
  }

  async assignReviewer(ideaId, reviewerId) {
    return prisma.idea.update({
      where: { id: ideaId },
      data: { reviewerId, status: 'Under_Review' },
      include: {
        innovator: { select: { id: true, name: true } },
        reviewer: { select: { id: true, name: true } }
      }
    });
  }

  async countByStatus() {
    const results = await prisma.idea.groupBy({
      by: ['status'],
      _count: { status: true }
    });
    return results.reduce((acc, r) => {
      acc[r.status] = r._count.status;
      return acc;
    }, {});
  }

  async countByDomain() {
    const results = await prisma.idea.groupBy({
      by: ['domain'],
      _count: { domain: true }
    });
    return results.reduce((acc, r) => {
      acc[r.domain] = r._count.domain;
      return acc;
    }, {});
  }

  async count() {
    return prisma.idea.count();
  }
}

module.exports = new IdeaRepository();
