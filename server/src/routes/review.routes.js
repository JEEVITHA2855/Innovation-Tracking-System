const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

router.use(authenticate);

// POST /api/reviews — Submit a review (Reviewer)
router.post('/', authorize('reviewer'), (req, res, next) => reviewController.create(req, res, next));

// GET /api/reviews/history — Get reviewer's history
router.get('/history', authorize('reviewer'), (req, res, next) => reviewController.getHistory(req, res, next));

// GET /api/reviews/idea/:ideaId — Get reviews for an idea
router.get('/idea/:ideaId', (req, res, next) => reviewController.getByIdea(req, res, next));

module.exports = router;
