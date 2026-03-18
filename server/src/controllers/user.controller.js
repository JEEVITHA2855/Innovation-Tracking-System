const userRepository = require('../repositories/user.repository');


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

  async update(req, res, next) {
    try {
      const userId = parseInt(req.params.id);
      const { name, email, role } = req.body;

      const existingUser = await userRepository.findById(userId);
      if (!existingUser) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      if (email && email !== existingUser.email) {
        const emailExists = await userRepository.findByEmail(email);
        if (emailExists) {
          return res.status(409).json({ success: false, message: 'Email already in use' });
        }
      }

      if (role) {
        const validRoles = ['innovator', 'reviewer', 'admin'];
        if (!validRoles.includes(role)) {
          return res.status(400).json({ success: false, message: 'Invalid role specified' });
        }
      }

      const updateData = {};
      if (name) updateData.name = name;
      if (email) updateData.email = email;
      if (role) updateData.role = role;

      const updatedUser = await userRepository.update(userId, updateData);
      const { password, ...userData } = updatedUser;

      res.json({ success: true, message: 'User updated successfully', data: userData });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const userId = parseInt(req.params.id);

      // Check if user exists
      const user = await userRepository.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      if (user.role === 'admin') {
        const adminCount = await userRepository.countByRole('admin');
        if (adminCount <= 1) {
          return res.status(400).json({ success: false, message: 'Cannot delete the last admin user' });
        }
      }

      if (req.user.id === userId) {
        return res.status(400).json({ success: false, message: 'You cannot delete your own account' });
      }
      await userRepository.delete(userId);

      res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
