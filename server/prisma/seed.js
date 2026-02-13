const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clear existing data
  await prisma.notification.deleteMany();
  await prisma.review.deleteMany();
  await prisma.idea.deleteMany();
  await prisma.user.deleteMany();

  // Create users with hashed passwords
  const password = await bcrypt.hash('password123', 10);

  const users = await Promise.all([
    prisma.user.create({
      data: { name: 'Alice Johnson', email: 'alice@example.com', password, role: 'innovator' }
    }),
    prisma.user.create({
      data: { name: 'Bob Smith', email: 'bob@example.com', password, role: 'innovator' }
    }),
    prisma.user.create({
      data: { name: 'Carol White', email: 'carol@example.com', password, role: 'innovator' }
    }),
    prisma.user.create({
      data: { name: 'David Brown', email: 'david@example.com', password, role: 'innovator' }
    }),
    prisma.user.create({
      data: { name: 'Emma Wilson', email: 'emma@example.com', password, role: 'innovator' }
    }),
    prisma.user.create({
      data: { name: 'Dr. Sarah Miller', email: 'sarah.m@example.com', password, role: 'reviewer' }
    }),
    prisma.user.create({
      data: { name: 'Prof. John Davis', email: 'john.d@example.com', password, role: 'reviewer' }
    }),
    prisma.user.create({
      data: { name: 'Admin User', email: 'admin@example.com', password, role: 'admin' }
    }),
  ]);

  const [alice, bob, carol, david, emma, sarah, john, admin] = users;

  // Create ideas
  const ideas = await Promise.all([
    prisma.idea.create({
      data: {
        title: 'AI-Powered Code Review Assistant',
        description: 'Develop an AI assistant that automatically reviews code for bugs, performance issues, and best practices. Manual code reviews are time-consuming and prone to human oversight.',
        domain: 'AI',
        status: 'Approved',
        innovatorId: alice.id,
        reviewerId: sarah.id
      }
    }),
    prisma.idea.create({
      data: {
        title: 'Blockchain-Based Supply Chain',
        description: 'Implement a blockchain system to track products from manufacture to delivery. Current supply chains lack transparency and are vulnerable to fraud.',
        domain: 'FinTech',
        status: 'Under_Review',
        innovatorId: bob.id,
        reviewerId: john.id
      }
    }),
    prisma.idea.create({
      data: {
        title: 'Telemedicine Platform for Rural Areas',
        description: 'Create a mobile-first telemedicine platform with AI-assisted diagnosis. Rural areas have limited access to healthcare professionals.',
        domain: 'Healthcare',
        status: 'Needs_Improvement',
        innovatorId: carol.id,
        reviewerId: sarah.id
      }
    }),
    prisma.idea.create({
      data: {
        title: 'Smart Campus Energy Management',
        description: 'IoT-based system to monitor and optimize energy usage across campus buildings. University campuses waste significant energy due to inefficient management.',
        domain: 'Sustainability',
        status: 'Submitted',
        innovatorId: david.id,
      }
    }),
    prisma.idea.create({
      data: {
        title: 'Personalized Learning Platform',
        description: 'AI-driven platform that adapts content and pace to individual student needs. One-size-fits-all education does not work for diverse learning styles.',
        domain: 'EdTech',
        status: 'Approved',
        innovatorId: emma.id,
        reviewerId: john.id
      }
    }),
    prisma.idea.create({
      data: {
        title: 'Waste Segregation AI Robot',
        description: 'Autonomous robot using computer vision to identify and sort waste automatically. Manual waste segregation is inefficient and often incorrect.',
        domain: 'Sustainability',
        status: 'Submitted',
        innovatorId: alice.id,
      }
    }),
    prisma.idea.create({
      data: {
        title: 'Mental Health Chatbot',
        description: 'AI chatbot providing 24/7 initial mental health screening and resources. Students lack immediate access to mental health support.',
        domain: 'Healthcare',
        status: 'Under_Review',
        innovatorId: bob.id,
        reviewerId: sarah.id
      }
    }),
    prisma.idea.create({
      data: {
        title: 'Decentralized Academic Credentials',
        description: 'Blockchain-based system for issuing and verifying academic certificates. Academic credentials are easy to forge and hard to verify.',
        domain: 'FinTech',
        status: 'Rejected',
        innovatorId: carol.id,
        reviewerId: john.id
      }
    }),
  ]);

  // Create reviews for ideas that have been reviewed
  await Promise.all([
    prisma.review.create({
      data: {
        ideaId: ideas[0].id,
        reviewerId: sarah.id,
        innovationScore: 9,
        feasibilityScore: 8,
        impactScore: 9,
        feedback: 'Excellent idea with strong practical applications. Well thought out solution.'
      }
    }),
    prisma.review.create({
      data: {
        ideaId: ideas[2].id,
        reviewerId: sarah.id,
        innovationScore: 7,
        feasibilityScore: 6,
        impactScore: 8,
        feedback: 'Good concept but needs more detail on implementation and regulatory compliance.'
      }
    }),
    prisma.review.create({
      data: {
        ideaId: ideas[4].id,
        reviewerId: john.id,
        innovationScore: 8,
        feasibilityScore: 9,
        impactScore: 8,
        feedback: 'Very practical and well-researched. Ready for implementation.'
      }
    }),
    prisma.review.create({
      data: {
        ideaId: ideas[7].id,
        reviewerId: john.id,
        innovationScore: 6,
        feasibilityScore: 4,
        impactScore: 7,
        feedback: 'Interesting concept but current implementation plan is not feasible with available resources.'
      }
    }),
  ]);

  // Create notifications
  await Promise.all([
    prisma.notification.create({
      data: { userId: alice.id, message: 'Your idea "AI-Powered Code Review Assistant" has been approved!' }
    }),
    prisma.notification.create({
      data: { userId: carol.id, message: 'Your idea "Telemedicine Platform" needs improvement. Check reviewer feedback.' }
    }),
    prisma.notification.create({
      data: { userId: sarah.id, message: 'New idea "Mental Health Chatbot" has been assigned to you for review.' }
    }),
    prisma.notification.create({
      data: { userId: admin.id, message: '2 new ideas have been submitted and need reviewer assignment.' }
    }),
  ]);

  console.log('Database seeded successfully!');
  console.log(`Created ${users.length} users, ${ideas.length} ideas, 4 reviews, 4 notifications`);
  console.log('\nLogin credentials (all users): password123');
  console.log('Admin: admin@example.com');
  console.log('Reviewer: sarah.m@example.com or john.d@example.com');
  console.log('Innovator: alice@example.com, bob@example.com, etc.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
