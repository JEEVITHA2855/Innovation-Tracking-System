/**
 * Socket.IO utility functions for real-time events
 * Used across controllers to emit real-time updates
 */

/**
 * Emit event to specific user
 * @param {number} userId - Target user ID
 * @param {string} event - Event name
 * @param {object} data - Event data
 */
const emitToUser = (userId, event, data) => {
  if (!global.io) return;
  
  global.io.to(`user_${userId}`).emit(event, {
    ...data,
    timestamp: new Date().toISOString()
  });
};

/**
 * Emit event to all users with specific role
 * @param {string} role - Target role (admin, reviewer, innovator)
 * @param {string} event - Event name
 * @param {object} data - Event data
 */
const emitToRole = (role, event, data) => {
  if (!global.io) return;
  
  global.io.to(`role_${role}`).emit(event, {
    ...data,
    timestamp: new Date().toISOString()
  });
};

/**
 * Emit event to all connected clients
 * @param {string} event - Event name
 * @param {object} data - Event data
 */
const emitToAll = (event, data) => {
  if (!global.io) return;
  
  global.io.emit(event, {
    ...data,
    timestamp: new Date().toISOString()
  });
};

/**
 * Emit idea-related events
 * @param {string} action - Action type (created, updated, assigned, reviewed)
 * @param {object} idea - Idea object
 * @param {object} additionalData - Additional event data
 */
const emitIdeaEvent = (action, idea, additionalData = {}) => {
  const eventData = {
    action,
    idea,
    ...additionalData
  };

  switch (action) {
    case 'created':
      // Notify all admins about new idea
      emitToRole('admin', 'idea_created', eventData);
      
      // Notify the innovator who created it
      emitToUser(idea.innovatorId, 'idea_created', eventData);
      break;

    case 'assigned':
      // Notify the assigned reviewer
      if (idea.reviewerId) {
        emitToUser(idea.reviewerId, 'reviewer_assigned', eventData);
      }
      
      // Notify the innovator
      emitToUser(idea.innovatorId, 'reviewer_assigned', eventData);
      
      // Notify all admins
      emitToRole('admin', 'reviewer_assigned', eventData);
      break;

    case 'reviewed':
      // Notify the innovator
      emitToUser(idea.innovatorId, 'idea_reviewed', eventData);
      
      // Notify all admins
      emitToRole('admin', 'idea_reviewed', eventData);
      
      // Notify the reviewer
      if (idea.reviewerId) {
        emitToUser(idea.reviewerId, 'idea_reviewed', eventData);
      }
      break;

    case 'status_updated':
      // Notify the innovator
      emitToUser(idea.innovatorId, 'status_updated', eventData);
      
      // Notify all admins
      emitToRole('admin', 'status_updated', eventData);
      
      // Notify the assigned reviewer if any
      if (idea.reviewerId) {
        emitToUser(idea.reviewerId, 'status_updated', eventData);
      }
      break;

    default:
      console.warn('Unknown idea action:', action);
  }
};

/**
 * Emit notification event
 * @param {number} userId - Target user ID
 * @param {object} notification - Notification object
 */
const emitNotification = (userId, notification) => {
  emitToUser(userId, 'notification_created', { notification });
};

/**
 * Emit analytics update (for admin dashboards)
 * @param {object} analyticsData - Analytics data
 */
const emitAnalyticsUpdate = (analyticsData) => {
  emitToRole('admin', 'analytics_updated', { analytics: analyticsData });
};

module.exports = {
  emitToUser,
  emitToRole,
  emitToAll,
  emitIdeaEvent,
  emitNotification,
  emitAnalyticsUpdate
};