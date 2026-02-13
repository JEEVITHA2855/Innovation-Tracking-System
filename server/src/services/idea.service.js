const ideaRepository = require('../repositories/idea.repository');
const notificationRepository = require('../repositories/notification.repository');

/**
 * Idea Service — handles idea management business logic and workflow
 */
class IdeaService {
  /**
   * Submit a new idea (Innovator)
   */
  async createIdea({ title, description, domain, innovatorId }) {
    const idea = await ideaRepository.create({
      title,
      description,
      domain,
      innovatorId
    });

    // Notify admins about new submission
    await notificationRepository.create({
      userId: innovatorId,
      message: `Your idea "${title}" has been submitted successfully.`
    });

    return idea;
  }

  /**
   * Get all ideas (Admin)
   */
  async getAllIdeas() {
    return ideaRepository.findAll();
  }

  /**
   * Get idea by ID
   */
  async getIdeaById(id) {
    const idea = await ideaRepository.findById(id);
    if (!idea) {
      const error = new Error('Idea not found');
      error.status = 404;
      throw error;
    }
    return idea;
  }

  /**
   * Get ideas by innovator (Innovator view)
   */
  async getIdeasByInnovator(innovatorId) {
    return ideaRepository.findByInnovatorId(innovatorId);
  }

  /**
   * Get ideas assigned to a reviewer (Reviewer view)
   */
  async getIdeasByReviewer(reviewerId) {
    return ideaRepository.findByReviewerId(reviewerId);
  }

  /**
   * Update idea status (Admin/Reviewer)
   * Workflow: Submitted → Under Review → Approved / Rejected / Needs Improvement
   */
  async updateIdeaStatus(ideaId, status, userId) {
    const validStatuses = ['Submitted', 'Under_Review', 'Approved', 'Rejected', 'Needs_Improvement'];
    if (!validStatuses.includes(status)) {
      const error = new Error('Invalid status');
      error.status = 400;
      throw error;
    }

    const idea = await ideaRepository.findById(ideaId);
    if (!idea) {
      const error = new Error('Idea not found');
      error.status = 404;
      throw error;
    }

    // Validate workflow transitions
    this._validateStatusTransition(idea.status, status);

    const updatedIdea = await ideaRepository.updateStatus(ideaId, status);

    // Notify the innovator about status change
    const statusDisplay = status.replace('_', ' ');
    await notificationRepository.create({
      userId: idea.innovatorId,
      message: `Your idea "${idea.title}" status has been updated to "${statusDisplay}".`
    });

    return updatedIdea;
  }

  /**
   * Assign a reviewer to an idea (Admin)
   */
  async assignReviewer(ideaId, reviewerId) {
    const idea = await ideaRepository.findById(ideaId);
    if (!idea) {
      const error = new Error('Idea not found');
      error.status = 404;
      throw error;
    }

    const updatedIdea = await ideaRepository.assignReviewer(ideaId, reviewerId);

    // Notify reviewer about assignment
    await notificationRepository.create({
      userId: reviewerId,
      message: `New idea "${idea.title}" has been assigned to you for review.`
    });

    // Notify innovator
    await notificationRepository.create({
      userId: idea.innovatorId,
      message: `Your idea "${idea.title}" is now under review.`
    });

    return updatedIdea;
  }

  /**
   * Get idea statistics
   */
  async getStats() {
    const [total, byStatus, byDomain] = await Promise.all([
      ideaRepository.count(),
      ideaRepository.countByStatus(),
      ideaRepository.countByDomain()
    ]);

    return {
      total,
      submitted: byStatus['Submitted'] || 0,
      underReview: byStatus['Under_Review'] || 0,
      approved: byStatus['Approved'] || 0,
      rejected: byStatus['Rejected'] || 0,
      needsImprovement: byStatus['Needs_Improvement'] || 0,
      byDomain
    };
  }

  /**
   * Validate status transitions follow the workflow
   */
  _validateStatusTransition(currentStatus, newStatus) {
    const allowedTransitions = {
      'Submitted': ['Under_Review'],
      'Under_Review': ['Approved', 'Rejected', 'Needs_Improvement'],
      'Needs_Improvement': ['Under_Review', 'Submitted'],
      'Approved': [],
      'Rejected': ['Submitted']
    };

    const allowed = allowedTransitions[currentStatus] || [];
    if (!allowed.includes(newStatus)) {
      const error = new Error(
        `Cannot transition from "${currentStatus}" to "${newStatus}"`
      );
      error.status = 400;
      throw error;
    }
  }
}

module.exports = new IdeaService();
