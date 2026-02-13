const reviewRepository = require('../repositories/review.repository');
const ideaRepository = require('../repositories/idea.repository');
const notificationRepository = require('../repositories/notification.repository');

/**
 * Review Service — handles review business logic
 */
class ReviewService {
  /**
   * Submit a review for an idea
   */
  async submitReview({ ideaId, reviewerId, innovationScore, feasibilityScore, impactScore, feedback, decision }) {
    // Validate the idea exists and is assigned to this reviewer
    const idea = await ideaRepository.findById(ideaId);
    if (!idea) {
      const error = new Error('Idea not found');
      error.status = 404;
      throw error;
    }

    if (idea.reviewerId !== reviewerId) {
      const error = new Error('You are not assigned to review this idea');
      error.status = 403;
      throw error;
    }

    // Validate scores (1-10)
    const scores = [innovationScore, feasibilityScore, impactScore];
    if (scores.some(s => s < 1 || s > 10)) {
      const error = new Error('Scores must be between 1 and 10');
      error.status = 400;
      throw error;
    }

    // Create the review
    const review = await reviewRepository.create({
      ideaId,
      reviewerId,
      innovationScore,
      feasibilityScore,
      impactScore,
      feedback
    });

    // Update idea status based on decision
    const validDecisions = ['Approved', 'Rejected', 'Needs_Improvement'];
    if (decision && validDecisions.includes(decision)) {
      await ideaRepository.updateStatus(ideaId, decision);
    }

    // Notify the innovator
    const statusDisplay = decision ? decision.replace('_', ' ') : 'reviewed';
    await notificationRepository.create({
      userId: idea.innovatorId,
      message: `Your idea "${idea.title}" has been ${statusDisplay}. Check reviewer feedback.`
    });

    return review;
  }

  /**
   * Get reviews by idea
   */
  async getReviewsByIdea(ideaId) {
    return reviewRepository.findByIdeaId(ideaId);
  }

  /**
   * Get review history for a reviewer
   */
  async getReviewHistory(reviewerId) {
    return reviewRepository.findByReviewerId(reviewerId);
  }

  /**
   * Get top rated ideas
   */
  async getTopRatedIdeas(limit) {
    return reviewRepository.getTopRatedIdeas(limit);
  }
}

module.exports = new ReviewService();
