require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const authRoutes = require('./routes/auth.routes');
const ideaRoutes = require('./routes/idea.routes');
const reviewRoutes = require('./routes/review.routes');
const notificationRoutes = require('./routes/notification.routes');
const reportRoutes = require('./routes/report.routes');
const userRoutes = require('./routes/user.routes');

const app = express();
const server = http.createServer(app);

// Socket.IO setup with CORS - Allow multiple origins
const allowedSocketOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5174',
  process.env.CLIENT_URL
].filter(Boolean);

const io = socketIo(server, {
  cors: {
    origin: allowedSocketOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Store socket connections by user ID for targeted messaging
const userSockets = new Map();

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // Handle user authentication and room joining
  socket.on('authenticate', (userData) => {
    try {
      const { userId, role } = userData;
      socket.userId = userId;
      socket.role = role;
      
      // Store socket for this user
      userSockets.set(userId, socket);
      
      // Join role-based rooms
      socket.join(`role_${role}`);
      socket.join(`user_${userId}`);
      
      console.log(`User ${userId} (${role}) authenticated and joined rooms`);
      
      // Send welcome message
      socket.emit('authenticated', { message: 'Connected successfully' });
    } catch (error) {
      console.error('Authentication error:', error);
      socket.emit('auth_error', { message: 'Authentication failed' });
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    if (socket.userId) {
      userSockets.delete(socket.userId);
      console.log(`User ${socket.userId} disconnected`);
    }
  });
});

// Make io instance available globally
global.io = io;

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Allow for development; configure properly for production
  crossOriginEmbedderPolicy: false
}));

// Logging Middleware
app.use(morgan('dev')); // Use 'dev' for development, 'combined' for production

// CORS Middleware - Allow multiple origins for development
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5174',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({ 
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`CORS Warning: Origin ${origin} not allowed`);
      callback(null, true); // Allow all in development
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/ideas', ideaRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/users', userRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Socket.IO server ready for real-time connections');
});

module.exports = { app, io };
