const userRepository = require('../repositories/user.repository');

/**
 * User Controller — handles HTTP requests for user management
 */
class UserController {
  async getAll(req, res, next) {
    try {
      const users = await userRepository.findAll();
      res.json({ success: true, data: users });
    } catch (error) {
      next(error);
    }
  }

  async getByRole(req, res, next) {
    try {
      const { role } = req.params;
      const users = await userRepository.findByRole(role);
      res.json({ success: true, data: users });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const user = await userRepository.findById(parseInt(req.params.id));
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      const { password, ...userData } = user;
      res.json({ success: true, data: userData });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
