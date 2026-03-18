import { io } from 'socket.io-client';

/**
 * Socket.IO client service for real-time communication
 */
class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.eventHandlers = new Map();
  }

  /**
   * Initialize socket connection
   * @param {string} serverUrl - Backend server URL
   * @param {object} auth - Authentication data { userId, role, token }
   */
  connect(serverUrl, auth) {
    if (this.socket) {
      this.disconnect();
    }

    this.socket = io(serverUrl, {
      auth: {
        token: auth.token
      },
      transports: ['websocket', 'polling']
    });

    // Handle connection
    this.socket.on('connect', () => {
      console.log('🔌 Connected to Socket.IO server');
      this.isConnected = true;
      
      // Authenticate with the server
      this.socket.emit('authenticate', {
        userId: auth.userId,
        role: auth.role
      });
    });

    // Handle authentication response
    this.socket.on('authenticated', (data) => {
      console.log('✅ Socket authenticated:', data.message);
    });

    this.socket.on('auth_error', (error) => {
      console.error('❌ Socket authentication failed:', error.message);
    });

    // Handle disconnection
    this.socket.on('disconnect', (reason) => {
      console.log('🔌 Disconnected from Socket.IO server:', reason);
      this.isConnected = false;
    });

    // Handle connection errors
    this.socket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error.message);
    });

    return this.socket;
  }

  /**
   * Disconnect from the socket server
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      console.log('🔌 Socket disconnected manually');
    }
  }

  /**
   * Subscribe to a socket event
   * @param {string} event - Event name
   * @param {function} handler - Event handler function
   */
  on(event, handler) {
    if (!this.socket) {
      console.warn('Socket not connected. Store handler for later.');
      // Store for future connection
      this.eventHandlers.set(event, handler);
      return;
    }

    this.socket.on(event, handler);
    this.eventHandlers.set(event, handler);
  }

  /**
   * Unsubscribe from a socket event
   * @param {string} event - Event name
   */
  off(event) {
    if (this.socket) {
      this.socket.off(event);
    }
    this.eventHandlers.delete(event);
  }

  /**
   * Emit an event to the server
   * @param {string} event - Event name
   * @param {object} data - Event data
   */
  emit(event, data) {
    if (this.socket && this.isConnected) {
      this.socket.emit(event, data);
    } else {
      console.warn('Socket not connected. Cannot emit event:', event);
    }
  }

  /**
   * Listen for real-time idea events
   * @param {function} onIdeaCreated - Handler for new ideas
   * @param {function} onReviewerAssigned - Handler for reviewer assignments
   * @param {function} onIdeaReviewed - Handler for idea reviews
   * @param {function} onStatusUpdated - Handler for status updates
   */
  subscribeToIdeaEvents({ onIdeaCreated, onReviewerAssigned, onIdeaReviewed, onStatusUpdated }) {
    if (onIdeaCreated) {
      this.on('idea_created', onIdeaCreated);
    }
    if (onReviewerAssigned) {
      this.on('reviewer_assigned', onReviewerAssigned);
    }
    if (onIdeaReviewed) {
      this.on('idea_reviewed', onIdeaReviewed);
    }
    if (onStatusUpdated) {
      this.on('status_updated', onStatusUpdated);
    }
  }

  /**
   * Listen for notification events
   * @param {function} onNotification - Handler for new notifications
   */
  subscribeToNotifications(onNotification) {
    this.on('notification_created', onNotification);
  }

  /**
   * Listen for analytics updates (admin only)
   * @param {function} onAnalyticsUpdate - Handler for analytics updates
   */
  subscribeToAnalytics(onAnalyticsUpdate) {
    this.on('analytics_updated', onAnalyticsUpdate);
  }

  /**
   * Check if socket is connected
   */
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      socketId: this.socket?.id
    };
  }
}

// Create a singleton instance
const socketService = new SocketService();

export default socketService;