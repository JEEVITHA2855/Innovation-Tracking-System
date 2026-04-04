const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const prisma = require('../config/database');
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

    // Generate tokens
    const accessToken = this._generateAccessToken(user);
    const refreshToken = await this._issueRefreshToken(user);

    return {
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      accessToken,
      refreshToken
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

    // Generate tokens
    const accessToken = this._generateAccessToken(user);
    const refreshToken = await this._issueRefreshToken(user);

    return {
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      accessToken,
      refreshToken
    };
  }

  async refreshAccessToken(rawRefreshToken) {
    const payload = this._verifyRefreshToken(rawRefreshToken);
    const hashedToken = this._hashToken(rawRefreshToken);

    const stored = await prisma.refreshToken.findFirst({
      where: {
        token: hashedToken,
        userId: payload.id,
        revokedAt: null,
        expiresAt: { gt: new Date() }
      }
    });

    if (!stored) {
      const error = new Error('Refresh token is invalid or expired');
      error.status = 401;
      throw error;
    }

    const user = await userRepository.findById(payload.id);
    if (!user) {
      const error = new Error('User not found');
      error.status = 401;
      throw error;
    }

    await prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revokedAt: new Date() }
    });

    const accessToken = this._generateAccessToken(user);
    const refreshToken = await this._issueRefreshToken(user);

    return {
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      accessToken,
      refreshToken
    };
  }

  async revokeRefreshToken(rawRefreshToken) {
    if (!rawRefreshToken) {
      return;
    }

    const hashedToken = this._hashToken(rawRefreshToken);
    await prisma.refreshToken.updateMany({
      where: { token: hashedToken, revokedAt: null },
      data: { revokedAt: new Date() }
    });
  }

  async revokeAllForUser(userId) {
    await prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() }
    });
  }

  /**
   * Generate JWT token
   */
  _generateAccessToken(user) {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
    );
  }

  _generateRefreshToken(user) {
    return jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
    );
  }

  _verifyRefreshToken(rawRefreshToken) {
    try {
      return jwt.verify(rawRefreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
      const authError = new Error('Invalid refresh token');
      authError.status = 401;
      throw authError;
    }
  }

  async _issueRefreshToken(user) {
    const rawToken = this._generateRefreshToken(user);
    const token = this._hashToken(rawToken);
    const expiresAt = new Date(Date.now() + this._refreshTtlMs());

    await prisma.refreshToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt
      }
    });

    return rawToken;
  }

  _refreshTtlMs() {
    const ttl = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
    const match = /^([0-9]+)([smhd])$/i.exec(ttl);
    if (!match) {
      return 7 * 24 * 60 * 60 * 1000;
    }

    const value = Number(match[1]);
    const unit = match[2].toLowerCase();

    if (unit === 's') return value * 1000;
    if (unit === 'm') return value * 60 * 1000;
    if (unit === 'h') return value * 60 * 60 * 1000;
    return value * 24 * 60 * 60 * 1000;
  }

  _hashToken(rawToken) {
    return crypto.createHash('sha256').update(rawToken).digest('hex');
  }
}

module.exports = new AuthService();
