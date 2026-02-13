const prisma = require('../config/database');

/**
 * User Repository — handles all database operations for users
 */
class UserRepository {
  async findById(id) {
    return prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email) {
    return prisma.user.findUnique({ where: { email } });
  }

  async create(data) {
    return prisma.user.create({ data });
  }

  async findAll() {
    return prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true }
    });
  }

  async findByRole(role) {
    return prisma.user.findMany({
      where: { role },
      select: { id: true, name: true, email: true, role: true, createdAt: true }
    });
  }

  async update(id, data) {
    return prisma.user.update({ where: { id }, data });
  }

  async delete(id) {
    return prisma.user.delete({ where: { id } });
  }
}

module.exports = new UserRepository();
