# Innovation Tracking System

Production-ready full-stack Innovation Tracking System with role-based workflows for Admin, Reviewer, and Innovator.

## Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: PostgreSQL (production), SQLite not used in this branch
- ORM: Prisma
- Auth: JWT access tokens + refresh tokens (HTTP-only cookie)
- Realtime: Socket.IO

## Production Security Included

- Access JWT with expiry (default 15m)
- Refresh token rotation (default 7d) stored hashed in database
- HTTP-only secure refresh cookie
- Role-based authorization middleware (`admin`, `reviewer`, `innovator`)
- Strong password policy (min 8 chars, uppercase, number, special char)
- Input validation with Joi
- Helmet hardening
- Strict CORS allowlist
- API rate limiting (`/api` + tighter `/api/v1/auth` limits)
- Centralized error handler without sensitive data in production
- Request logging with morgan

## API Versioning

All primary APIs are served under:

- `/api/v1/auth`
- `/api/v1/ideas`
- `/api/v1/reviews`
- `/api/v1/users`
- `/api/v1/notifications`
- `/api/v1/reports`

Health checks:

- `/api/health`
- `/api/v1/health`

## Environment Setup

Do not commit `.env` files. Use examples:

- `server/.env.example`
- `client/.env.example`
- `.env.example`

Minimum backend variables:

```env
PORT=5000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/innovation_tracking?schema=public
JWT_SECRET=replace_with_long_random_secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=replace_with_long_random_refresh_secret
JWT_REFRESH_EXPIRES_IN=7d
NODE_ENV=production
CORS_ORIGINS=https://your-frontend-domain.vercel.app
RATE_LIMIT_MAX=300
AUTH_RATE_LIMIT_MAX=20
```

Frontend variable:

```env
VITE_API_URL=https://your-backend-url
VITE_USE_SESSION_STORAGE=false
```

Docker is not required for the database in this project. Use a normal PostgreSQL installation on your machine or a hosted PostgreSQL instance.

## Local Development

### 1. Install dependencies

```bash
npm run install:all
```

### 2. Backend

```bash
cd server
copy .env.example .env
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

### 3. Frontend

```bash
cd client
copy .env.example .env
npm run dev
```

## PostgreSQL Production Database

1. Create PostgreSQL instance in Neon/Supabase/Railway.
2. Copy connection string to `DATABASE_URL`.
3. Run Prisma deploy migration:

```bash
cd server
npx prisma generate
npx prisma migrate deploy
```

Schema includes production indexes:

- `users.email`
- `ideas.status`
- `ideas.reviewer_id`
- `reviews.reviewer_id`
- refresh token lookup indexes

## Deployment

### Backend (Render/Railway/AWS)

1. Push repository to GitHub.
2. Create service from repository.
3. Root/start command for backend:

```bash
cd server && npm install && npx prisma generate && npx prisma migrate deploy && npm start
```

4. Set backend environment variables from `server/.env.example`.
5. Set `CORS_ORIGINS` to your frontend domain.

### Database (Neon/Supabase/Railway)

1. Provision PostgreSQL.
2. Set `DATABASE_URL` in backend service.
3. Run Prisma deploy migration.

### Frontend (Vercel/Netlify)

1. Import repository.
2. Build settings:
   - Root: `client`
   - Build: `npm run build`
   - Output: `dist`
3. Set environment variable:

```env
VITE_API_URL=https://your-backend-url
```

## Production Checklist

- User login works
- Access token and refresh flow works
- Role-based route and API protection works
- CRUD works for ideas/reviews/users
- API errors are standardized and sanitized
- Frontend points to deployed backend
- CORS allowlist blocks unknown origins
- PostgreSQL connection and migrations are healthy

## Repository Structure

```text
Innovation-Tracking-System/
├── client/
├── server/
├── .env.example
└── README.md
```
