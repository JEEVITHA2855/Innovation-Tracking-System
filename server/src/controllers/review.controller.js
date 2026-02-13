const reviewService = require('../services/review.service');

/**
 * Review Controller — handles HTTP requests for reviews
 */
class ReviewController {
  async create(req, res, next) {
    try {
      const { ideaId, innovationScore, feasibilityScore, impactScore, feedback, decision } = req.body;

      if (!ideaId || !innovationScore || !feasibilityScore || !impactScore || !feedback) {
        return res.status(400).json({
          success: false,
          message: 'All score fields, ideaId, and feedback are required'
        });
      }

      const review = await reviewService.submitReview({
        ideaId,
        reviewerId: req.user.id,
        innovationScore,
        feasibilityScore,
        impactScore,
        feedback,
        decision
      });

      res.status(201).json({ success: true, data: review });
    } catch (error) {
      next(error);
    }
  }

  async getByIdea(req, res, next) {
    try {
      const reviews = await reviewService.getReviewsByIdea(parseInt(req.params.ideaId));
      res.json({ success: true, data: reviews });
    } catch (error) {
      next(error);
    }
  }

  async getHistory(req, res, next) {
    try {
      const reviews = await reviewService.getReviewHistory(req.user.id);
      res.json({ success: true, data: reviews });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ReviewController();
