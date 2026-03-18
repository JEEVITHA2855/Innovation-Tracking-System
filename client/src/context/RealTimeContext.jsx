import React, { createContext, useContext, useEffect, useReducer } from 'react';
import socketService from '../services/socket';
import { useApp } from './AppContext';

// Real-time state structure
const initialState = {
  // Socket connection status
  isConnected: false,
  
  // Real-time data updates
  latestIdea: null,
  latestReview: null,
  latestNotification: null,
  
  // Update flags for UI refresh
  ideasNeedRefresh: false,
  reviewsNeedRefresh: false,
  analyticsNeedRefresh: false,
  notificationsNeedRefresh: false,
  
  // Real-time event log for debugging
  eventLog: []
};

// Actions for real-time updates
const ACTIONS = {
  SET_CONNECTED: 'SET_CONNECTED',
  NEW_IDEA_CREATED: 'NEW_IDEA_CREATED',
  REVIEWER_ASSIGNED: 'REVIEWER_ASSIGNED',
  IDEA_REVIEWED: 'IDEA_REVIEWED',
  STATUS_UPDATED: 'STATUS_UPDATED',
  NEW_NOTIFICATION: 'NEW_NOTIFICATION',
  ANALYTICS_UPDATED: 'ANALYTICS_UPDATED',
  RESET_REFRESH_FLAGS: 'RESET_REFRESH_FLAGS',
  ADD_EVENT_LOG: 'ADD_EVENT_LOG'
};

// Reducer for real-time state
const realTimeReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_CONNECTED:
      return {
        ...state,
        isConnected: action.payload
      };

    case ACTIONS.NEW_IDEA_CREATED:
      return {
        ...state,
        latestIdea: action.payload.idea,
        ideasNeedRefresh: true,
        analyticsNeedRefresh: true,
        eventLog: [...state.eventLog.slice(-4), {
          type: 'idea_created',
          message: action.payload.message,
          timestamp: new Date().toISOString()
        }]
      };

    case ACTIONS.REVIEWER_ASSIGNED:
      return {
        ...state,
        ideasNeedRefresh: true,
        analyticsNeedRefresh: true,
        eventLog: [...state.eventLog.slice(-4), {
          type: 'reviewer_assigned',
          message: action.payload.message,
          timestamp: new Date().toISOString()
        }]
      };

    case ACTIONS.IDEA_REVIEWED:
      return {
        ...state,
        latestReview: action.payload.review,
        ideasNeedRefresh: true,
        reviewsNeedRefresh: true,
        analyticsNeedRefresh: true,
        eventLog: [...state.eventLog.slice(-4), {
          type: 'idea_reviewed',
          message: action.payload.message,
          timestamp: new Date().toISOString()
        }]
      };

    case ACTIONS.STATUS_UPDATED:
      return {
        ...state,
        ideasNeedRefresh: true,
        analyticsNeedRefresh: true,
        eventLog: [...state.eventLog.slice(-4), {
          type: 'status_updated',
          message: action.payload.message,
          timestamp: new Date().toISOString()
        }]
      };

    case ACTIONS.NEW_NOTIFICATION:
      return {
        ...state,
        latestNotification: action.payload.notification,
        notificationsNeedRefresh: true,
        eventLog: [...state.eventLog.slice(-4), {
          type: 'notification',
          message: 'New notification received',
          timestamp: new Date().toISOString()
        }]
      };

    case ACTIONS.ANALYTICS_UPDATED:
      return {
        ...state,
        analyticsNeedRefresh: true
      };

    case ACTIONS.RESET_REFRESH_FLAGS:
      return {
        ...state,
        ideasNeedRefresh: false,
        reviewsNeedRefresh: false,
        analyticsNeedRefresh: false,
        notificationsNeedRefresh: false
      };

    case ACTIONS.ADD_EVENT_LOG:
      return {
        ...state,
        eventLog: [...state.eventLog.slice(-4), action.payload]
      };

    default:
      return state;
  }
};

// Real-time context
const RealTimeContext = createContext(null);

export const useRealTime = () => {
  const context = useContext(RealTimeContext);
  if (!context) {
    throw new Error('useRealTime must be used within RealTimeProvider');
  }
  return context;
};

// RealTimeProvider component
export const RealTimeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(realTimeReducer, initialState);
  const { currentUser, token } = useApp();
  const isAuthenticated = !!currentUser;

  // Initialize socket connection when user is authenticated
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      const serverUrl = import.meta.env.VITE_API_URL || 'http://localhost:5003';
      const authToken = localStorage.getItem('auth_token');
      
      console.log('🔌 Initializing socket connection...');
      
      socketService.connect(serverUrl, {
        userId: currentUser.id,
        role: currentUser.role,
        token: authToken
      });

      // Update connection status
      socketService.on('connect', () => {
        dispatch({ type: ACTIONS.SET_CONNECTED, payload: true });
      });

      socketService.on('disconnect', () => {
        dispatch({ type: ACTIONS.SET_CONNECTED, payload: false });
      });

      // Subscribe to idea events
      socketService.subscribeToIdeaEvents({
        onIdeaCreated: (data) => {
          console.log('📨 Real-time: New idea created', data);
          dispatch({ type: ACTIONS.NEW_IDEA_CREATED, payload: data });
        },
        
        onReviewerAssigned: (data) => {
          console.log('📨 Real-time: Reviewer assigned', data);
          dispatch({ type: ACTIONS.REVIEWER_ASSIGNED, payload: data });
        },
        
        onIdeaReviewed: (data) => {
          console.log('📨 Real-time: Idea reviewed', data);
          dispatch({ type: ACTIONS.IDEA_REVIEWED, payload: data });
        },
        
        onStatusUpdated: (data) => {
          console.log('📨 Real-time: Status updated', data);
          dispatch({ type: ACTIONS.STATUS_UPDATED, payload: data });
        }
      });

      // Subscribe to notifications
      socketService.subscribeToNotifications((data) => {
        console.log('📨 Real-time: New notification', data);
        dispatch({ type: ACTIONS.NEW_NOTIFICATION, payload: data });
      });

      // Subscribe to analytics (admin only)
      if (currentUser.role === 'admin') {
        socketService.subscribeToAnalytics((data) => {
          console.log('📨 Real-time: Analytics updated', data);
          dispatch({ type: ACTIONS.ANALYTICS_UPDATED, payload: data });
        });
      }

      // Cleanup on unmount
      return () => {
        socketService.disconnect();
        dispatch({ type: ACTIONS.SET_CONNECTED, payload: false });
      };
    }
  }, [isAuthenticated, currentUser]);

  // Helper functions for components
  const resetRefreshFlags = () => {
    dispatch({ type: ACTIONS.RESET_REFRESH_FLAGS });
  };

  const value = {
    ...state,
    resetRefreshFlags,
    socketService
  };

  return (
    <RealTimeContext.Provider value={value}>
      {children}
    </RealTimeContext.Provider>
  );
};