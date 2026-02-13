const express = require('express');
const router = express.Router();
const ideaController = require('../controllers/idea.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

// All idea routes are protected
router.use(authenticate);

// POST /api/ideas — Submit a new idea (Innovator)
router.post('/', authorize('innovator'), (req, res, next) => ideaController.create(req, res, next));

// GET /api/ideas — Get all ideas (Admin)
router.get('/', authorize('admin'), (req, res, next) => ideaController.getAll(req, res, next));

// GET /api/ideas/stats — Get idea statistics
router.get('/stats', authorize('admin'), (req, res, next) => ideaController.getStats(req, res, next));

// GET /api/ideas/my — Get current user's ideas (Innovator)
router.get('/my', authorize('innovator'), (req, res, next) => ideaController.getMyIdeas(req, res, next));

// GET /api/ideas/assigned — Get assigned ideas (Reviewer)
router.get('/assigned', authorize('reviewer'), (req, res, next) => ideaController.getAssignedIdeas(req, res, next));

// GET /api/ideas/:id — Get idea by ID
router.get('/:id', (req, res, next) => ideaController.getById(req, res, next));

// PUT /api/ideas/:id/status — Update idea status
router.put('/:id/status', authorize('admin', 'reviewer'), (req, res, next) => ideaController.updateStatus(req, res, next));

// PUT /api/ideas/:id/assign — Assign reviewer to idea (Admin)
router.put('/:id/assign', authorize('admin'), (req, res, next) => ideaController.assignReviewer(req, res, next));

module.exports = router;
