require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const authRoutes = require('./routes/auth.routes');
const ideaRoutes = require('./routes/idea.routes');
const reviewRoutes = require('./routes/review.routes');
const notificationRoutes = require('./routes/notification.routes');
const reportRoutes = require('./routes/report.routes');
const userRoutes = require('./routes/user.routes');
const prisma = require('./config/database');
const { apiLimiter, authLimiter } = require('./middlewares/rate-limit.middleware');
const { errorHandler, notFoundHandler } = require('./middlewares/error.middleware');

const app = express();
const server = http.createServer(app);
const API_PREFIX = '/api/v1';
const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET', 'JWT_REFRESH_SECRET'];

for (const key of requiredEnvVars) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

const normalizeOrigin = (value) => {
  if (!value) return '';

  try {
    const parsed = new URL(value);
    return `${parsed.protocol}//${parsed.host}`.toLowerCase();
  } catch {
    return value.trim().replace(/\/+$/, '').toLowerCase();
  }
};

const allowedOrigins = (process.env.CORS_ORIGINS || process.env.CLIENT_URL || 'http://localhost:5173,http://localhost:3000')
  .split(',')
  .map((origin) => normalizeOrigin(origin))
  .filter(Boolean);

const isLocalhostOrigin = (origin) => {
  try {
    const parsed = new URL(origin);
    return parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1';
  } catch {
    return false;
  }
};

const isOriginAllowed = (origin) => {
  if (!origin) return true;

  const normalizedOrigin = normalizeOrigin(origin);
  if (allowedOrigins.includes(normalizedOrigin)) {
    return true;
  }

  if (process.env.NODE_ENV !== 'production' && isLocalhostOrigin(origin)) {
    return true;
  }

  return false;
};

// Socket.IO setup with CORS - Allow multiple origins
const io = socketIo(server, {
  cors: {
    origin: (origin, callback) => {
      if (isOriginAllowed(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Socket origin not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Store socket connections by user ID for targeted messaging
const userSockets = new Map();

io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error('Unauthorized socket connection'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (error) {
    next(new Error('Unauthorized socket connection'));
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // Handle user authentication and room joining
  socket.on('authenticate', () => {
    try {
      const { id: userId, role } = socket.user;
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
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

// Logging Middleware
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// CORS Middleware
const corsOptions = {
  origin: (origin, callback) => {
    if (isOriginAllowed(origin)) {
      return callback(null, true);
    }

    // Avoid throwing into the global error handler for preflight checks.
    console.warn(`Blocked CORS request from origin: ${origin || 'unknown'}`);
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api', apiLimiter);
app.use(`${API_PREFIX}/auth`, authLimiter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get(`${API_PREFIX}/health`, (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/ideas`, ideaRoutes);
app.use(`${API_PREFIX}/reviews`, reviewRoutes);
app.use(`${API_PREFIX}/notifications`, notificationRoutes);
app.use(`${API_PREFIX}/reports`, reportRoutes);
app.use(`${API_PREFIX}/users`, userRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await prisma.$connect();

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log('Socket.IO server ready for real-time connections');
    });
  } catch (error) {
    console.error('Failed to connect to database using DATABASE_URL');
    console.error(error.message);
    process.exit(1);
  }
}

startServer();

module.exports = { app, io };
