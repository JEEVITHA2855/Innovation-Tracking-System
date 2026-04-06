const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function upsertUser({ name, email, role, password }) {
  return prisma.user.upsert({
    where: { email },
    create: { name, email, role, password },
    update: { name, role, password }
  });
}

async function upsertIdea(data) {
  const existingIdea = await prisma.idea.findFirst({
    where: {
      title: data.title,
      innovatorId: data.innovatorId
    }
  });

  if (!existingIdea) {
    return prisma.idea.create({ data });
  }

  return prisma.idea.update({
    where: { id: existingIdea.id },
    data: {
      description: data.description,
      domain: data.domain,
      status: data.status,
      reviewerId: data.reviewerId
    }
  });
}

async function upsertReview(data) {
  const existingReview = await prisma.review.findFirst({
    where: {
      ideaId: data.ideaId,
      reviewerId: data.reviewerId
    }
  });

  if (!existingReview) {
    await prisma.review.create({ data });
    return;
  }

  await prisma.review.update({
    where: { id: existingReview.id },
    data: {
      innovationScore: data.innovationScore,
      feasibilityScore: data.feasibilityScore,
      impactScore: data.impactScore,
      feedback: data.feedback
    }
  });
}

async function createNotificationIfMissing(data) {
  const existingNotification = await prisma.notification.findFirst({
    where: {
      userId: data.userId,
      message: data.message
    }
  });

  if (!existingNotification) {
    await prisma.notification.create({ data });
  }
}

async function main() {
  console.log('Seeding database (non-destructive)...');

  const password = await bcrypt.hash('password123', 10);

  const users = await Promise.all([
    upsertUser({ name: 'Alice Johnson', email: 'alice@example.com', role: 'innovator', password }),
    upsertUser({ name: 'Bob Smith', email: 'bob@example.com', role: 'innovator', password }),
    upsertUser({ name: 'Carol White', email: 'carol@example.com', role: 'innovator', password }),
    upsertUser({ name: 'David Brown', email: 'david@example.com', role: 'innovator', password }),
    upsertUser({ name: 'Emma Wilson', email: 'emma@example.com', role: 'innovator', password }),
    upsertUser({ name: 'Dr. Sarah Miller', email: 'sarah.m@example.com', role: 'reviewer', password }),
    upsertUser({ name: 'Prof. John Davis', email: 'john.d@example.com', role: 'reviewer', password }),
    upsertUser({ name: 'Admin User', email: 'admin@example.com', role: 'admin', password })
  ]);

  const [alice, bob, carol, david, emma, sarah, john, admin] = users;

  const ideas = [];
  ideas.push(await upsertIdea({
    title: 'AI-Powered Code Review Assistant',
    description: 'Develop an AI assistant that automatically reviews code for bugs, performance issues, and best practices. Manual code reviews are time-consuming and prone to human oversight.',
    domain: 'AI',
    status: 'Approved',
    innovatorId: alice.id,
    reviewerId: sarah.id
  }));

  ideas.push(await upsertIdea({
    title: 'Blockchain-Based Supply Chain',
    description: 'Implement a blockchain system to track products from manufacture to delivery. Current supply chains lack transparency and are vulnerable to fraud.',
    domain: 'FinTech',
    status: 'Under_Review',
    innovatorId: bob.id,
    reviewerId: john.id
  }));

  ideas.push(await upsertIdea({
    title: 'Telemedicine Platform for Rural Areas',
    description: 'Create a mobile-first telemedicine platform with AI-assisted diagnosis. Rural areas have limited access to healthcare professionals.',
    domain: 'Healthcare',
    status: 'Needs_Improvement',
    innovatorId: carol.id,
    reviewerId: sarah.id
  }));

  ideas.push(await upsertIdea({
    title: 'Smart Campus Energy Management',
    description: 'IoT-based system to monitor and optimize energy usage across campus buildings. University campuses waste significant energy due to inefficient management.',
    domain: 'Sustainability',
    status: 'Submitted',
    innovatorId: david.id,
    reviewerId: null
  }));

  ideas.push(await upsertIdea({
    title: 'Personalized Learning Platform',
    description: 'AI-driven platform that adapts content and pace to individual student needs. One-size-fits-all education does not work for diverse learning styles.',
    domain: 'EdTech',
    status: 'Approved',
    innovatorId: emma.id,
    reviewerId: john.id
  }));

  ideas.push(await upsertIdea({
    title: 'Waste Segregation AI Robot',
    description: 'Autonomous robot using computer vision to identify and sort waste automatically. Manual waste segregation is inefficient and often incorrect.',
    domain: 'Sustainability',
    status: 'Submitted',
    innovatorId: alice.id,
    reviewerId: null
  }));

  ideas.push(await upsertIdea({
    title: 'Mental Health Chatbot',
    description: 'AI chatbot providing 24/7 initial mental health screening and resources. Students lack immediate access to mental health support.',
    domain: 'Healthcare',
    status: 'Under_Review',
    innovatorId: bob.id,
    reviewerId: sarah.id
  }));

  ideas.push(await upsertIdea({
    title: 'Decentralized Academic Credentials',
    description: 'Blockchain-based system for issuing and verifying academic certificates. Academic credentials are easy to forge and hard to verify.',
    domain: 'FinTech',
    status: 'Rejected',
    innovatorId: carol.id,
    reviewerId: john.id
  }));

  await upsertReview({
    ideaId: ideas[0].id,
    reviewerId: sarah.id,
    innovationScore: 9,
    feasibilityScore: 8,
    impactScore: 9,
    feedback: 'Excellent idea with strong practical applications. Well thought out solution.'
  });

  await upsertReview({
    ideaId: ideas[2].id,
    reviewerId: sarah.id,
    innovationScore: 7,
    feasibilityScore: 6,
    impactScore: 8,
    feedback: 'Good concept but needs more detail on implementation and regulatory compliance.'
  });

  await upsertReview({
    ideaId: ideas[4].id,
    reviewerId: john.id,
    innovationScore: 8,
    feasibilityScore: 9,
    impactScore: 8,
    feedback: 'Very practical and well-researched. Ready for implementation.'
  });

  await upsertReview({
    ideaId: ideas[7].id,
    reviewerId: john.id,
    innovationScore: 6,
    feasibilityScore: 4,
    impactScore: 7,
    feedback: 'Interesting concept but current implementation plan is not feasible with available resources.'
  });

  await createNotificationIfMissing({ userId: alice.id, message: 'Your idea "AI-Powered Code Review Assistant" has been approved!' });
  await createNotificationIfMissing({ userId: carol.id, message: 'Your idea "Telemedicine Platform" needs improvement. Check reviewer feedback.' });
  await createNotificationIfMissing({ userId: sarah.id, message: 'New idea "Mental Health Chatbot" has been assigned to you for review.' });
  await createNotificationIfMissing({ userId: admin.id, message: '2 new ideas have been submitted and need reviewer assignment.' });

  console.log('Database seeded successfully!');
  console.log(`Ensured ${users.length} users, ${ideas.length} ideas, 4 reviews, 4 notifications`);
  console.log('\nLogin credentials (all seeded users): password123');
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
