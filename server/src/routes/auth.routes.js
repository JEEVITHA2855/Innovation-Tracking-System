const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validation.middleware');
const { registerSchema, loginSchema } = require('../validators/auth.validator');

// POST /api/auth/register
router.post('/register', validate(registerSchema), (req, res, next) => authController.register(req, res, next));

// POST /api/auth/login
router.post('/login', validate(loginSchema), (req, res, next) => authController.login(req, res, next));

// GET /api/auth/me — Get current user (protected)
router.get('/me', authenticate, (req, res, next) => authController.me(req, res, next));

module.exports = router;
