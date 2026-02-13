const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

router.use(authenticate);

// GET /api/users — Get all users (Admin)
router.get('/', authorize('admin'), (req, res, next) => userController.getAll(req, res, next));

// GET /api/users/role/:role — Get users by role (Admin)
router.get('/role/:role', authorize('admin'), (req, res, next) => userController.getByRole(req, res, next));

// GET /api/users/:id — Get user by ID
router.get('/:id', (req, res, next) => userController.getById(req, res, next));

module.exports = router;
