const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

// Helper function to print section headers
function printHeader(title) {
  console.log('\n' + '='.repeat(80));
  console.log(`${colors.bright}${colors.cyan}${title}${colors.reset}`);
  console.log('='.repeat(80));
}

// Helper function to print a divider
function printDivider() {
  console.log('-'.repeat(80));
}

async function displayData() {
  try {
    // Display Users
    printHeader('👥 USERS');
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (users.length === 0) {
      console.log('No users found.');
    } else {
      users.forEach((user, index) => {
        console.log(`\n${colors.bright}User ${index + 1}:${colors.reset}`);
        console.log(`  ID:         ${colors.blue}${user.id}${colors.reset}`);
        console.log(`  Name:       ${colors.green}${user.name}${colors.reset}`);
        console.log(`  Email:      ${user.email}`);
        console.log(`  Role:       ${colors.yellow}${user.role}${colors.reset}`);
        console.log(`  Created:    ${new Date(user.createdAt).toLocaleString()}`);
      });
      console.log(`\n${colors.bright}Total Users: ${users.length}${colors.reset}`);
    }

    // Display Ideas
    printHeader('💡 IDEAS');
    const ideas = await prisma.idea.findMany({
      include: {
        innovator: {
          select: {
            name: true,
            email: true,
          },
        },
        reviewer: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (ideas.length === 0) {
      console.log('No ideas found.');
    } else {
      ideas.forEach((idea, index) => {
        console.log(`\n${colors.bright}Idea ${index + 1}:${colors.reset}`);
        console.log(`  ID:          ${colors.blue}${idea.id}${colors.reset}`);
        console.log(`  Title:       ${colors.green}${idea.title}${colors.reset}`);
        console.log(`  Description: ${idea.description.substring(0, 100)}${idea.description.length > 100 ? '...' : ''}`);
        console.log(`  Domain:      ${colors.cyan}${idea.domain}${colors.reset}`);
        console.log(`  Status:      ${colors.yellow}${idea.status}${colors.reset}`);
        console.log(`  Innovator:   ${idea.innovator.name} (${idea.innovator.email})`);
        console.log(`  Reviewer:    ${idea.reviewer ? `${idea.reviewer.name} (${idea.reviewer.email})` : 'Not assigned'}`);
        console.log(`  Created:     ${new Date(idea.createdAt).toLocaleString()}`);
        console.log(`  Updated:     ${new Date(idea.updatedAt).toLocaleString()}`);
      });
      console.log(`\n${colors.bright}Total Ideas: ${ideas.length}${colors.reset}`);
    }

    // Display Reviews
    printHeader('📝 REVIEWS');
    const reviews = await prisma.review.findMany({
      include: {
        idea: {
          select: {
            title: true,
          },
        },
        reviewer: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (reviews.length === 0) {
      console.log('No reviews found.');
    } else {
      reviews.forEach((review, index) => {
        const totalScore = review.innovationScore + review.feasibilityScore + review.impactScore;
        const avgScore = (totalScore / 3).toFixed(1);
        
        console.log(`\n${colors.bright}Review ${index + 1}:${colors.reset}`);
        console.log(`  ID:                ${colors.blue}${review.id}${colors.reset}`);
        console.log(`  Idea:              ${colors.green}${review.idea.title}${colors.reset}`);
        console.log(`  Reviewer:          ${review.reviewer.name} (${review.reviewer.email})`);
        console.log(`  Innovation Score:  ${colors.cyan}${review.innovationScore}/10${colors.reset}`);
        console.log(`  Feasibility Score: ${colors.cyan}${review.feasibilityScore}/10${colors.reset}`);
        console.log(`  Impact Score:      ${colors.cyan}${review.impactScore}/10${colors.reset}`);
        console.log(`  ${colors.bright}Average Score:     ${colors.magenta}${avgScore}/10${colors.reset}`);
        console.log(`  Feedback:          ${review.feedback.substring(0, 100)}${review.feedback.length > 100 ? '...' : ''}`);
        console.log(`  Created:           ${new Date(review.createdAt).toLocaleString()}`);
      });
      console.log(`\n${colors.bright}Total Reviews: ${reviews.length}${colors.reset}`);
    }

    // Display Notifications
    printHeader('🔔 NOTIFICATIONS');
    const notifications = await prisma.notification.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (notifications.length === 0) {
      console.log('No notifications found.');
    } else {
      notifications.forEach((notification, index) => {
        console.log(`\n${colors.bright}Notification ${index + 1}:${colors.reset}`);
        console.log(`  ID:       ${colors.blue}${notification.id}${colors.reset}`);
        console.log(`  User:     ${notification.user.name} (${notification.user.email})`);
        console.log(`  Message:  ${notification.message}`);
        console.log(`  Status:   ${notification.isRead ? `${colors.green}Read${colors.reset}` : `${colors.yellow}Unread${colors.reset}`}`);
        console.log(`  Created:  ${new Date(notification.createdAt).toLocaleString()}`);
      });
      console.log(`\n${colors.bright}Total Notifications: ${notifications.length}${colors.reset}`);
    }

    // Display Summary Statistics
    printHeader('📊 SUMMARY STATISTICS');
    const stats = {
      totalUsers: users.length,
      totalIdeas: ideas.length,
      totalReviews: reviews.length,
      totalNotifications: notifications.length,
      usersByRole: {},
      ideasByStatus: {},
      unreadNotifications: notifications.filter(n => !n.isRead).length,
    };

    // Count users by role
    users.forEach(user => {
      stats.usersByRole[user.role] = (stats.usersByRole[user.role] || 0) + 1;
    });

    // Count ideas by status
    ideas.forEach(idea => {
      stats.ideasByStatus[idea.status] = (stats.ideasByStatus[idea.status] || 0) + 1;
    });

    console.log(`\n${colors.bright}Users:${colors.reset}`);
    Object.entries(stats.usersByRole).forEach(([role, count]) => {
      console.log(`  ${role}: ${colors.green}${count}${colors.reset}`);
    });
    console.log(`  ${colors.bright}Total: ${stats.totalUsers}${colors.reset}`);

    console.log(`\n${colors.bright}Ideas:${colors.reset}`);
    Object.entries(stats.ideasByStatus).forEach(([status, count]) => {
      console.log(`  ${status}: ${colors.cyan}${count}${colors.reset}`);
    });
    console.log(`  ${colors.bright}Total: ${stats.totalIdeas}${colors.reset}`);

    console.log(`\n${colors.bright}Reviews:${colors.reset} ${colors.blue}${stats.totalReviews}${colors.reset}`);
    
    console.log(`\n${colors.bright}Notifications:${colors.reset}`);
    console.log(`  Total: ${colors.blue}${stats.totalNotifications}${colors.reset}`);
    console.log(`  Unread: ${colors.yellow}${stats.unreadNotifications}${colors.reset}`);

    printDivider();
    console.log(`\n${colors.green}✓ Data display completed successfully!${colors.reset}\n`);

  } catch (error) {
    console.error(`${colors.bright}\n❌ Error fetching data:${colors.reset}`, error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function
displayData();
