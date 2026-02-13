const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/user.repository');

/**
 * Auth Service — handles authentication business logic
 */
class AuthService {
  /**
   * Register a new user
   */
  async register({ name, email, password, role }) {
    // Check if user already exists
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      const error = new Error('User with this email already exists');
      error.status = 409;
      throw error;
    }

    // Validate role
    const validRoles = ['innovator', 'reviewer', 'admin'];
    if (!validRoles.includes(role)) {
      const error = new Error('Invalid role specified');
      error.status = 400;
      throw error;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await userRepository.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    // Generate token
    const token = this._generateToken(user);

    return {
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token
    };
  }

  /**
   * Authenticate a user
   */
  async login({ email, password }) {
    // Find user
    const user = await userRepository.findByEmail(email);
    if (!user) {
      const error = new Error('Invalid email or password');
      error.status = 401;
      throw error;
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      const error = new Error('Invalid email or password');
      error.status = 401;
      throw error;
    }

    // Generate token
    const token = this._generateToken(user);

    return {
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token
    };
  }

  /**
   * Generate JWT token
   */
  _generateToken(user) {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );
  }
}

module.exports = new AuthService();
