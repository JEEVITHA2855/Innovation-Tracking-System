const authService = require('../services/auth.service');

/**
 * Auth Controller — handles HTTP requests for authentication
 */
class AuthController {
  async register(req, res, next) {
    try {
      const { name, email, password, role } = req.body;

      if (!name || !email || !password || !role) {
        return res.status(400).json({
          success: false,
          message: 'Name, email, password, and role are required'
        });
      }

      const result = await authService.register({ name, email, password, role });
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required'
        });
      }

      const result = await authService.login({ email, password });
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async me(req, res, next) {
    try {
      res.json({ success: true, data: { user: req.user } });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
