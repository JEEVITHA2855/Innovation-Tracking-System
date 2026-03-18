# Innovation Tracking System - API Testing Guide

## Table of Contents
1. [Setup](#setup)
2. [Authentication APIs](#authentication-apis)
3. [Idea APIs](#idea-apis)
4. [Review APIs](#review-apis)
5. [Admin APIs](#admin-apis)
6. [User APIs](#user-apis)
7. [Notification APIs](#notification-apis)
8. [Reports APIs](#reports-apis)

---

## Setup

### Base URL
```
http://localhost:5004/api
```

### Headers
For authenticated endpoints, include:
```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

---

## Authentication APIs

### 1. Register a New User

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "innovator"
}
```

**Valid Roles:** `innovator`, `reviewer`, `admin`

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "innovator"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Validation Rules:**
- Name: 2-100 characters
- Email: Valid email format
- Password: 6-128 characters
- Role: Must be one of: innovator, reviewer, admin

---

### 2. Login

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "innovator"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 3. Get Current User Profile

**Endpoint:** `GET /auth/me`

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "john@example.com",
      "role": "innovator"
    }
  }
}
```

---

## Idea APIs

### 1. Submit New Idea (Innovator)

**Endpoint:** `POST /ideas`

**Role Required:** `innovator`

**Headers:**
```
Authorization: Bearer <innovator_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "AI-Powered Smart Agriculture System",
  "description": "An innovative solution that uses AI and IoT sensors to optimize crop yield, reduce water usage, and predict pest infestations. The system analyzes soil data, weather patterns, and historical crop performance to provide actionable insights to farmers.",
  "domain": "AI"
}
```

**Validation Rules:**
- Title: 5-200 characters
- Description: 20-5000 characters
- Domain: 2-50 characters

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "AI-Powered Smart Agriculture System",
    "description": "An innovative solution...",
    "domain": "AI",
    "status": "Submitted",
    "innovatorId": 1,
    "reviewerId": null,
    "createdAt": "2026-03-07T10:00:00.000Z",
    "updatedAt": "2026-03-07T10:00:00.000Z"
  }
}
```

---

### 2. Get All Ideas (Admin)

**Endpoint:** `GET /ideas`

**Role Required:** `admin`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "AI-Powered Smart Agriculture System",
      "description": "An innovative solution...",
      "domain": "AI",
      "status": "Submitted",
      "innovatorId": 1,
      "reviewerId": null,
      "createdAt": "2026-03-07T10:00:00.000Z",
      "updatedAt": "2026-03-07T10:00:00.000Z",
      "innovator": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com"
      },
      "reviewer": null
    }
  ]
}
```

---

### 3. Get My Ideas (Innovator)

**Endpoint:** `GET /ideas/my`

**Role Required:** `innovator`

**Headers:**
```
Authorization: Bearer <innovator_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "AI-Powered Smart Agriculture System",
      "description": "An innovative solution...",
      "domain": "AI",
      "status": "Submitted",
      "innovatorId": 1,
      "reviewerId": null,
      "createdAt": "2026-03-07T10:00:00.000Z"
    }
  ]
}
```

---

### 4. Get Assigned Ideas (Reviewer)

**Endpoint:** `GET /ideas/assigned`

**Role Required:** `reviewer`

**Headers:**
```
Authorization: Bearer <reviewer_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "AI-Powered Smart Agriculture System",
      "description": "An innovative solution...",
      "domain": "AI",
      "status": "Under Review",
      "innovatorId": 1,
      "reviewerId": 2,
      "createdAt": "2026-03-07T10:00:00.000Z"
    }
  ]
}
```

---

### 5. Get Idea by ID

**Endpoint:** `GET /ideas/:id`

**Example:** `GET /ideas/1`

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "AI-Powered Smart Agriculture System",
    "description": "An innovative solution...",
    "domain": "AI",
    "status": "Submitted",
    "innovatorId": 1,
    "reviewerId": null,
    "createdAt": "2026-03-07T10:00:00.000Z",
    "innovator": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    },
    "reviewer": null,
    "reviews": []
  }
}
```

---

### 6. Assign Reviewer to Idea (Admin)

**Endpoint:** `PUT /ideas/:id/assign`

**Example:** `PUT /ideas/1/assign`

**Role Required:** `admin`

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "reviewerId": 2
}
```

**Validation Rules:**
- reviewerId: Must be a positive integer

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "AI-Powered Smart Agriculture System",
    "description": "An innovative solution...",
    "domain": "AI",
    "status": "Under Review",
    "innovatorId": 1,
    "reviewerId": 2,
    "updatedAt": "2026-03-07T11:00:00.000Z"
  }
}
```

---

### 7. Update Idea Status (Admin/Reviewer)

**Endpoint:** `PUT /ideas/:id/status`

**Example:** `PUT /ideas/1/status`

**Role Required:** `admin` or `reviewer`

**Headers:**
```
Authorization: Bearer <admin_or_reviewer_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "Under Review"
}
```

**Valid Status Values:**
- `Submitted`
- `Under Review`
- `Approved`
- `Rejected`
- `On Hold`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "AI-Powered Smart Agriculture System",
    "status": "Under Review",
    "updatedAt": "2026-03-07T11:00:00.000Z"
  }
}
```

---

### 8. Get Idea Statistics (Admin)

**Endpoint:** `GET /ideas/stats`

**Role Required:** `admin`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "totalIdeas": 10,
    "submittedIdeas": 3,
    "underReviewIdeas": 4,
    "approvedIdeas": 2,
    "rejectedIdeas": 1
  }
}
```

---

## Review APIs

### 1. Submit Review (Reviewer)

**Endpoint:** `POST /reviews`

**Role Required:** `reviewer`

**Headers:**
```
Authorization: Bearer <reviewer_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "ideaId": 1,
  "innovationScore": 8,
  "feasibilityScore": 7,
  "impactScore": 9,
  "feedback": "This is an excellent idea with strong potential. The use of AI for agriculture is timely and addresses real problems. However, consider the initial cost and farmer adoption challenges.",
  "decision": "Approved"
}
```

**Validation Rules:**
- ideaId: Positive integer (required)
- innovationScore: Integer between 1-10 (required)
- feasibilityScore: Integer between 1-10 (required)
- impactScore: Integer between 1-10 (required)
- feedback: 10-2000 characters (required)
- decision: One of: Approved, Rejected, Needs Revision (optional)

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "ideaId": 1,
    "reviewerId": 2,
    "innovationScore": 8,
    "feasibilityScore": 7,
    "impactScore": 9,
    "feedback": "This is an excellent idea...",
    "createdAt": "2026-03-07T12:00:00.000Z",
    "idea": {
      "id": 1,
      "title": "AI-Powered Smart Agriculture System",
      "status": "Approved"
    }
  }
}
```

---

### 2. Get Reviews for an Idea

**Endpoint:** `GET /reviews/idea/:ideaId`

**Example:** `GET /reviews/idea/1`

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "ideaId": 1,
      "reviewerId": 2,
      "innovationScore": 8,
      "feasibilityScore": 7,
      "impactScore": 9,
      "feedback": "This is an excellent idea...",
      "createdAt": "2026-03-07T12:00:00.000Z",
      "reviewer": {
        "id": 2,
        "name": "Jane Smith",
        "email": "jane@example.com"
      }
    }
  ]
}
```

---

### 3. Get Review History (Reviewer)

**Endpoint:** `GET /reviews/history`

**Role Required:** `reviewer`

**Headers:**
```
Authorization: Bearer <reviewer_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "ideaId": 1,
      "reviewerId": 2,
      "innovationScore": 8,
      "feasibilityScore": 7,
      "impactScore": 9,
      "feedback": "This is an excellent idea...",
      "createdAt": "2026-03-07T12:00:00.000Z",
      "idea": {
        "id": 1,
        "title": "AI-Powered Smart Agriculture System",
        "domain": "AI"
      }
    }
  ]
}
```

---

## Admin APIs

### 1. Get All Ideas (Admin)

**Endpoint:** `GET /ideas`

**Role Required:** `admin`

*(Already documented in Idea APIs section)*

---

### 2. Assign Reviewer (Admin)

**Endpoint:** `PUT /ideas/:id/assign`

**Role Required:** `admin`

*(Already documented in Idea APIs section)*

---

## User APIs

### 1. Get All Users (Admin)

**Endpoint:** `GET /users`

**Role Required:** `admin`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "innovator",
      "createdAt": "2026-03-07T09:00:00.000Z"
    },
    {
      "id": 2,
      "name": "Jane Smith",
      "email": "jane@example.com",
      "role": "reviewer",
      "createdAt": "2026-03-07T09:30:00.000Z"
    }
  ]
}
```

---

### 2. Get Users by Role (Admin)

**Endpoint:** `GET /users/role/:role`

**Example:** `GET /users/role/reviewer`

**Role Required:** `admin`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 2,
      "name": "Jane Smith",
      "email": "jane@example.com",
      "role": "reviewer",
      "createdAt": "2026-03-07T09:30:00.000Z"
    }
  ]
}
```

---

### 3. Get User by ID

**Endpoint:** `GET /users/:id`

**Example:** `GET /users/1`

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "innovator",
    "createdAt": "2026-03-07T09:00:00.000Z"
  }
}
```

---

## Notification APIs

### 1. Get All Notifications

**Endpoint:** `GET /notifications`

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "userId": 1,
      "message": "Your idea 'AI-Powered Smart Agriculture System' has been assigned to a reviewer",
      "isRead": false,
      "createdAt": "2026-03-07T11:00:00.000Z"
    }
  ]
}
```

---

### 2. Get Unread Count

**Endpoint:** `GET /notifications/unread-count`

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "unreadCount": 3
  }
}
```

---

### 3. Mark Notification as Read

**Endpoint:** `PUT /notifications/:id/read`

**Example:** `PUT /notifications/1/read`

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "isRead": true
  }
}
```

---

### 4. Mark All as Read

**Endpoint:** `PUT /notifications/read-all`

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "All notifications marked as read"
}
```

---

## Reports APIs

### 1. Get Analytics (Admin)

**Endpoint:** `GET /reports/analytics`

**Role Required:** `admin`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "totalIdeas": 25,
    "totalReviews": 18,
    "totalUsers": 30,
    "ideasByStatus": {
      "Submitted": 5,
      "Under Review": 8,
      "Approved": 10,
      "Rejected": 2
    },
    "ideasByDomain": {
      "AI": 8,
      "Web": 5,
      "FinTech": 4,
      "Healthcare": 3,
      "Other": 5
    },
    "averageScores": {
      "innovation": 7.5,
      "feasibility": 6.8,
      "impact": 7.2
    }
  }
}
```

---

## Error Responses

### Validation Error (400)
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Email must be valid"
    },
    {
      "field": "password",
      "message": "Password must be at least 6 characters"
    }
  ]
}
```

### Unauthorized (401)
```json
{
  "success": false,
  "message": "Access token required"
}
```

### Forbidden (403)
```json
{
  "success": false,
  "message": "Insufficient permissions"
}
```

### Not Found (404)
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### Conflict (409)
```json
{
  "success": false,
  "message": "User with this email already exists"
}
```

### Server Error (500)
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Testing Workflow

### Step 1: Register Users
1. Register an Admin user
2. Register a Reviewer user
3. Register an Innovator user

### Step 2: Login
1. Login as each user type
2. Save the JWT tokens for each role

### Step 3: Innovator Flow
1. Login as Innovator
2. Submit a new idea
3. View "My Ideas"
4. Check notifications

### Step 4: Admin Flow
1. Login as Admin
2. View all ideas
3. Get list of reviewers (`GET /users/role/reviewer`)
4. Assign a reviewer to an idea
5. View analytics

### Step 5: Reviewer Flow
1. Login as Reviewer
2. View assigned ideas
3. Submit a review for an idea
4. View review history

### Step 6: Verify Real-time Updates
1. Have multiple browser tabs/Postman tabs open with different user roles
2. Perform actions and verify real-time notifications via Socket.IO

---

## Postman Collection

You can import this structure into Postman:

1. Create a new collection named "Innovation Tracking System"
2. Add an environment with variables:
   - `base_url`: http://localhost:5004/api
   - `admin_token`: (will be set after login)
   - `reviewer_token`: (will be set after login)
   - `innovator_token`: (will be set after login)
3. Create folders for each API category
4. Add requests as documented above
5. Use `{{base_url}}` and `{{role_token}}` variables in requests

---

## Security Features Implemented

✅ **JWT Authentication** - All protected routes require valid JWT token  
✅ **Role-Based Authorization** - Users can only access resources based on their role  
✅ **Password Hashing** - Passwords are hashed using bcrypt  
✅ **Input Validation** - All inputs are validated using Joi schemas  
✅ **Helmet Security** - HTTP headers secured with Helmet middleware  
✅ **CORS Protection** - CORS configured to allow only specific origins  
✅ **Request Logging** - All requests logged using Morgan middleware  
✅ **Error Handling** - Centralized error handling with proper status codes

---

## Database Schema

### Users Table
- `user_id` (INT, PK, Auto-increment)
- `name` (String)
- `email` (String, Unique)
- `password` (String, Hashed)
- `role` (String: innovator, reviewer, admin)
- `created_at` (DateTime)

### Ideas Table
- `idea_id` (INT, PK, Auto-increment)
- `title` (String)
- `description` (String)
- `domain` (String)
- `status` (String)
- `innovator_id` (FK → Users)
- `reviewer_id` (FK → Users, Nullable)
- `created_at` (DateTime)
- `updated_at` (DateTime)

### Reviews Table
- `review_id` (INT, PK, Auto-increment)
- `idea_id` (FK → Ideas)
- `reviewer_id` (FK → Users)
- `innovation_score` (Int, 1-10)
- `feasibility_score` (Int, 1-10)
- `impact_score` (Int, 1-10)
- `feedback` (String)
- `created_at` (DateTime)

### Notifications Table
- `notification_id` (INT, PK, Auto-increment)
- `user_id` (FK → Users)
- `message` (String)
- `is_read` (Boolean)
- `created_at` (DateTime)
