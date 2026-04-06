# Innovation Tracking System

A production-ready full-stack application for managing innovation ideas across three roles: Innovator, Reviewer, and Admin. The platform supports secure authentication, role-based dashboards, idea submission, reviewer assignment, evaluation workflows, notifications, and real-time updates.

## Overview

The system is designed for organizations that need a structured process to capture innovation ideas, route them to reviewers, and track outcomes from submission to decision. Instead of handling ideas through email or spreadsheets, the application centralizes the full workflow in one place.

## Problem Statement

Organizations often lose ideas or manage them manually with inconsistent review processes. That creates delays, poor visibility, weak accountability, and limited tracking of idea progress.

## Solution

This project provides a web-based innovation tracking workflow where:
- Innovators submit ideas through a guided form.
- Admins can view all ideas and assign reviewers.
- Reviewers can evaluate assigned ideas with scores and feedback.
- Users receive notifications and status updates in real time.

## Features

- Secure user authentication with JWT access tokens and refresh tokens
- Role-based access control for Innovator, Reviewer, and Admin
- Idea submission and tracking
- Reviewer assignment by Admin
- Idea review with scoring and feedback
- Notification system
- Real-time updates using Socket.IO
- Analytics and reporting for admins
- Responsive UI built with reusable components

## Tech Stack

### Frontend
- React 19
- Vite
- Axios
- React Router
- Context API
- Socket.IO client
- Tailwind CSS

### Backend
- Node.js
- Express.js
- Prisma ORM
- JWT authentication
- bcrypt
- Socket.IO
- Joi validation
- Helmet
- CORS
- Morgan
- express-rate-limit

### Database
- PostgreSQL for deployment
- SQLite for local development

## Architecture / Flow

The application follows a layered architecture:

1. Frontend sends a request from the React UI.
2. Axios adds the access token automatically.
3. Express routes receive the request.
4. Middleware verifies JWT and user role.
5. Controllers handle request logic.
6. Services contain business rules.
7. Prisma repositories interact with the database.
8. The backend sends a response and emits real-time events when needed.

### Example flow
- Innovator logs in
- Submits an idea
- Backend stores the idea using Prisma
- Admin sees the idea in the dashboard
- Admin assigns a reviewer
- Reviewer submits feedback and scores
- Status updates and notifications are pushed to the user

## Setup Instructions

### Prerequisites
- Node.js
- npm
- PostgreSQL for deployment or SQLite for local development

### Local Installation

#### 1. Clone the repository
```bash
git clone https://github.com/JEEVITHA2855/Innovation-Tracking-System.git
cd Innovation-Tracking-System
```

#### 2. Install dependencies
```bash
cd server
npm install

cd ../client
npm install
```

#### 3. Configure environment files
Create your environment files from the examples:
- [server/.env.example](server/.env.example)
- [client/.env.example](client/.env.example)

#### 4. Start the backend
```bash
cd server
npx prisma generate
npx prisma migrate dev
npm run dev
```

#### 5. Start the frontend
```bash
cd client
npm run dev
```

## Environment Variables

### Backend
```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/innovation_tracking?schema=public
JWT_SECRET=your_long_random_secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_long_random_refresh_secret
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGINS=https://your-frontend-domain.vercel.app
CLIENT_URL=https://your-frontend-domain.vercel.app
RATE_LIMIT_MAX=300
AUTH_RATE_LIMIT_MAX=20
```

### Frontend
```env
VITE_API_URL=https://your-backend-domain.onrender.com
VITE_USE_SESSION_STORAGE=false
```

## API Endpoints

The backend is versioned under `/api/v1`.

### Authentication
- POST `/api/v1/auth/register`
- POST `/api/v1/auth/login`
- POST `/api/v1/auth/refresh`
- POST `/api/v1/auth/logout`
- GET `/api/v1/auth/me`

### Ideas
- POST `/api/v1/ideas`
- GET `/api/v1/ideas`
- GET `/api/v1/ideas/my`
- GET `/api/v1/ideas/assigned`
- GET `/api/v1/ideas/:id`
- PUT `/api/v1/ideas/:id/status`
- PUT `/api/v1/ideas/:id/assign`
- GET `/api/v1/ideas/stats`

### Reviews
- POST `/api/v1/reviews`
- GET `/api/v1/reviews/idea/:ideaId`
- GET `/api/v1/reviews/history`

### Users
- GET `/api/v1/users`
- GET `/api/v1/users/role/:role`
- GET `/api/v1/users/:id`
- PUT `/api/v1/users/:id`
- DELETE `/api/v1/users/:id`

### Notifications
- GET `/api/v1/notifications`
- GET `/api/v1/notifications/unread-count`
- PUT `/api/v1/notifications/:id/read`
- PUT `/api/v1/notifications/read-all`

### Reports
- GET `/api/v1/reports/analytics`

### Health Checks
- GET `/api/health`
- GET `/api/v1/health`

## Deployment

### Frontend
- Platform: Vercel
- Root directory: `client`
- Build command: `npm run build`
- Output directory: `dist`

### Backend
- Platform: Render
- Root directory: `server`
- Build command: `npm install && npx prisma generate && npx prisma migrate deploy && npm run prisma:seed`
- Start command: `npm start`

### Database
- Platform: Render PostgreSQL, Neon, Supabase, or Railway
- Use PostgreSQL in production
- SQLite is only for local development

## Challenges Faced

- Migrating from local SQLite data to hosted PostgreSQL
- Fixing API version path mismatches between frontend and backend
- Resolving CORS and secure-cookie issues during deployment
- Making the seed script safe for repeated production runs
- Ensuring frontend login uses the correct backend URL

## Future Improvements

- Email notifications
- File attachments for ideas
- Advanced analytics dashboards
- Search and filter for ideas and reviews
- Pagination for larger datasets
- Audit logs for admin actions
- Better mobile UI refinements

## Default Demo Credentials

After seeding, you can test with:
- Admin: `admin@example.com`
- Reviewer: `sarah.m@example.com` or `john.d@example.com`
- Innovator: `alice@example.com`, `bob@example.com`, and others
- Password for all seeded users: `password123`

## Project Structure

```text
Innovation-Tracking-System/
├── client/
│   └── src/
├── server/
│   ├── prisma/
│   └── src/
├── README.md
└── .env.example
```

## Notes

- The frontend API client automatically appends `/api/v1` to the backend base URL.
- The backend uses JWT authentication with an httpOnly refresh cookie for secure session handling.
- Real-time updates are delivered through Socket.IO after the user logs in.
