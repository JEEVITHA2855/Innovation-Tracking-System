const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkUsers() {
  try {
    const users = await prisma.user.findMany();
    console.log('Total users:', users.length);
    console.log('User emails:');
    users.forEach(user => {
      console.log(`- ${user.email} (${user.role})`);
    });
    
    // Test specific login user
    const admin = await prisma.user.findUnique({
      where: { email: 'admin@example.com' }
    });
    console.log('\nAdmin user:', admin ? 'EXISTS' : 'NOT FOUND');
    
  } catch (error) {
    console.error('Database error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();