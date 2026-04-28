# Innovation Tracking System

A production-ready full-stack application for managing innovation workflows across organizations. The system enables structured idea submission, evaluation, and tracking through role-based access and real-time collaboration.

---

## Overview

The Innovation Tracking System centralizes the lifecycle of ideas — from submission to evaluation — replacing fragmented workflows such as emails and spreadsheets with a scalable, role-driven platform.

It supports three primary roles:

* **Innovator** — submits and tracks ideas
* **Reviewer** — evaluates ideas with feedback and scoring
* **Admin** — manages users, assigns reviewers, and monitors progress

---

## Problem Statement

Organizations often lack a structured system to manage innovation. This results in:

* Lost or overlooked ideas
* Inconsistent evaluation processes
* Limited visibility into progress
* Delayed decision-making

---

## Solution

This system provides a centralized workflow where:

* Ideas are submitted through a structured interface
* Reviewers are assigned dynamically
* Evaluations are standardized with scoring and feedback
* Real-time updates keep users informed
* Admins gain visibility through analytics

---

## Key Features

* JWT-based authentication with access and refresh tokens
* Role-based access control (RBAC)
* Idea submission and lifecycle tracking
* Reviewer assignment and evaluation workflow
* Real-time notifications using Socket.IO
* Admin analytics and reporting
* Secure backend with validation, rate limiting, and middleware

---

## Tech Stack

### Frontend

* React (Vite)
* Axios
* React Router
* Context API
* Tailwind CSS
* Socket.IO Client

### Backend

* Node.js
* Express.js
* Prisma ORM
* PostgreSQL (production) / SQLite (local)
* JWT Authentication
* bcrypt
* Joi Validation
* Helmet, CORS, Morgan
* express-rate-limit

---

## System Architecture

```text
Client (React)
   ↓
API Layer (Axios with JWT)
   ↓
Express Routes
   ↓
Middleware (Auth, RBAC, Validation)
   ↓
Controllers
   ↓
Services (Business Logic)
   ↓
Prisma ORM
   ↓
Database (PostgreSQL / SQLite)
```

---

## Example Workflow

* User logs in as Innovator
* Submits a new idea
* Admin reviews and assigns a Reviewer
* Reviewer evaluates and scores the idea
* System updates status and sends notifications
* Admin monitors progress through analytics

---

## API Overview

Base route: `/api/v1`

### Authentication

* POST `/auth/register`
* POST `/auth/login`
* POST `/auth/refresh`
* POST `/auth/logout`
* GET `/auth/me`

### Ideas

* POST `/ideas`
* GET `/ideas`
* GET `/ideas/my`
* GET `/ideas/assigned`
* PUT `/ideas/:id/status`
* PUT `/ideas/:id/assign`

### Reviews

* POST `/reviews`
* GET `/reviews/idea/:ideaId`

### Notifications

* GET `/notifications`
* PUT `/notifications/:id/read`

---

## Setup Instructions

### Prerequisites

* Node.js
* PostgreSQL (or SQLite for local)

### Installation

```bash
git clone https://github.com/JEEVITHA2855/Innovation-Tracking-System.git
cd Innovation-Tracking-System
```

```bash
cd server
npm install

cd ../client
npm install
```

### Run Backend

```bash
cd server
npx prisma generate
npx prisma migrate dev
npm run dev
```

### Run Frontend

```bash
cd client
npm run dev
```

---

## Deployment

* **Frontend**: Vercel
* **Backend**: Render
* **Database**: PostgreSQL (Render / Supabase / Neon)

---

## Engineering Highlights

* Designed a layered backend architecture separating controllers, services, and data access
* Implemented secure authentication using JWT with refresh token strategy
* Built role-based access control (RBAC) for multi-user workflows
* Integrated real-time communication using Socket.IO
* Applied production-grade middleware (rate limiting, validation, security headers)
* Structured API with versioning and modular routing

---

## Challenges

* Migrating from SQLite to PostgreSQL in production
* Handling CORS and secure cookies across environments
* Synchronizing real-time updates with API state
* Ensuring consistent API versioning between frontend and backend

---

## Future Improvements

* Email-based notifications
* Advanced filtering and search
* Pagination for scalability
* Audit logging for admin actions
* Enhanced analytics dashboards

---

## Resume Impact

Built a full-stack innovation management system with role-based workflows, real-time updates, and secure authentication using Node.js, React, Prisma, and PostgreSQL, demonstrating scalable backend architecture and API design.

---

## Notes

* Uses JWT with httpOnly refresh cookies for session security
* Real-time updates are handled via Socket.IO
* API is versioned for maintainability (`/api/v1`)

---
Live Demo: https://innovation-tracking-system.vercel.app/
