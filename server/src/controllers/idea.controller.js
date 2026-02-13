const ideaService = require('../services/idea.service');

/**
 * Idea Controller — handles HTTP requests for idea management
 */
class IdeaController {
  async create(req, res, next) {
    try {
      const { title, description, domain } = req.body;
      if (!title || !description || !domain) {
        return res.status(400).json({
          success: false,
          message: 'Title, description, and domain are required'
        });
      }

      const idea = await ideaService.createIdea({
        title,
        description,
        domain,
        innovatorId: req.user.id
      });

      res.status(201).json({ success: true, data: idea });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const ideas = await ideaService.getAllIdeas();
      res.json({ success: true, data: ideas });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const idea = await ideaService.getIdeaById(parseInt(req.params.id));
      res.json({ success: true, data: idea });
    } catch (error) {
      next(error);
    }
  }

  async getMyIdeas(req, res, next) {
    try {
      const ideas = await ideaService.getIdeasByInnovator(req.user.id);
      res.json({ success: true, data: ideas });
    } catch (error) {
      next(error);
    }
  }

  async getAssignedIdeas(req, res, next) {
    try {
      const ideas = await ideaService.getIdeasByReviewer(req.user.id);
      res.json({ success: true, data: ideas });
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req, res, next) {
    try {
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({
          success: false,
          message: 'Status is required'
        });
      }

      const idea = await ideaService.updateIdeaStatus(
        parseInt(req.params.id),
        status,
        req.user.id
      );

      res.json({ success: true, data: idea });
    } catch (error) {
      next(error);
    }
  }

  async assignReviewer(req, res, next) {
    try {
      const { reviewerId } = req.body;
      if (!reviewerId) {
        return res.status(400).json({
          success: false,
          message: 'Reviewer ID is required'
        });
      }

      const idea = await ideaService.assignReviewer(
        parseInt(req.params.id),
        reviewerId
      );

      res.json({ success: true, data: idea });
    } catch (error) {
      next(error);
    }
  }

  async getStats(req, res, next) {
    try {
      const stats = await ideaService.getStats();
      res.json({ success: true, data: stats });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new IdeaController();
