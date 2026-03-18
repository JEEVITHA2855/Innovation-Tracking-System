# Innovation Tracking System

A comprehensive full-stack web application for managing and tracking innovation ideas within an organization. The system enables innovators to submit ideas, admins to assign reviewers, and reviewers to evaluate ideas with real-time notifications and analytics.

## 🚀 Features

### Core Functionality
- **Multi-Role System**: Support for Innovators, Reviewers, and Admins
- **Idea Management**: Submit, track, and manage innovation ideas
- **Review System**: Comprehensive review process with scoring and feedback
- **Real-Time Updates**: Socket.IO integration for instant notifications
- **Analytics Dashboard**: Visual insights for admins

### Security & Best Practices
- ✅ JWT-based authentication with bcrypt password hashing
- ✅ Role-based authorization
- ✅ Input validation using Joi schemas
- ✅ Helmet security middleware for HTTP headers
- ✅ Morgan logging middleware
- ✅ CORS protection
- ✅ Centralized error handling

## 🛠️ Technology Stack

### Frontend
- **React.js** (v19.2.4) with Vite
- **React Router DOM** (v7.13.0) for routing
- **Axios** for API calls
- **Tailwind CSS** for styling
- **Socket.IO Client** for real-time updates
- **Recharts** for data visualization
- **Lucide React** for icons

### Backend
- **Node.js** with Express.js
- **Prisma ORM** with SQLite database
- **JWT** for authentication
- **bcrypt** for password hashing
- **Socket.IO** for WebSocket connections
- **Helmet** for security headers
- **Morgan** for request logging
- **Joi** for input validation

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Innovation-Tracking-System
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:
```env
PORT=5004
DATABASE_URL="file:./dev.db"
JWT_SECRET=innovation_tracking_super_secret_key_2026
JWT_EXPIRES_IN=24h
CLIENT_URL=http://localhost:5173
```

Initialize the database:
```bash
npx prisma generate
npx prisma migrate dev
npx prisma db seed
```

Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5004`

### 3. Frontend Setup
```bash
cd client
npm install
```

Create a `.env` file in the `client` directory:
```env
VITE_API_URL=http://localhost:5004
```

Start the frontend development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 📁 Project Structure

```
Innovation-Tracking-System/
├── server/
│   ├── prisma/
│   │   ├── schema.prisma          # Database schema
│   │   ├── seed.js                # Database seeding
│   │   └── migrations/            # Database migrations
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js        # Database configuration
│   │   ├── controllers/           # Request handlers
│   │   │   ├── auth.controller.js
│   │   │   ├── idea.controller.js
│   │   │   ├── review.controller.js
│   │   │   ├── user.controller.js
│   │   │   ├── notification.controller.js
│   │   │   └── report.controller.js
│   │   ├── services/              # Business logic
│   │   │   ├── auth.service.js
│   │   │   ├── idea.service.js
│   │   │   ├── review.service.js
│   │   │   ├── notification.service.js
│   │   │   └── report.service.js
│   │   ├── repositories/          # Database operations
│   │   │   ├── user.repository.js
│   │   │   ├── idea.repository.js
│   │   │   ├── review.repository.js
│   │   │   └── notification.repository.js
│   │   ├── routes/                # API routes
│   │   │   ├── auth.routes.js
│   │   │   ├── idea.routes.js
│   │   │   ├── review.routes.js
│   │   │   ├── user.routes.js
│   │   │   ├── notification.routes.js
│   │   │   └── report.routes.js
│   │   ├── middlewares/           # Custom middleware
│   │   │   ├── auth.middleware.js
│   │   │   └── validation.middleware.js
│   │   ├── validators/            # Joi validation schemas
│   │   │   ├── auth.validator.js
│   │   │   ├── idea.validator.js
│   │   │   └── review.validator.js
│   │   ├── utils/
│   │   │   └── socket.js          # Socket.IO utilities
│   │   └── index.js               # Entry point
│   ├── .env                       # Environment variables
│   └── package.json
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   └── common/            # Reusable components
│   │   │       ├── Card.jsx
│   │   │       ├── Layout.jsx
│   │   │       ├── Loading.jsx
│   │   │       ├── Modal.jsx
│   │   │       ├── Sidebar.jsx
│   │   │       ├── StatusBadge.jsx
│   │   │       ├── Table.jsx
│   │   │       └── Toast.jsx
│   │   ├── context/               # React Context
│   │   │   ├── AppContext.jsx     # Authentication & state
│   │   │   └── RealTimeContext.jsx # WebSocket connection
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── admin/             # Admin pages
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   ├── AllIdeas.jsx
│   │   │   │   ├── Analytics.jsx
│   │   │   │   └── ManageReviewers.jsx
│   │   │   ├── innovator/         # Innovator pages
│   │   │   │   ├── InnovatorDashboard.jsx
│   │   │   │   ├── MyIdeas.jsx
│   │   │   │   ├── SubmitIdea.jsx
│   │   │   │   └── IdeaDetails.jsx
│   │   │   └── reviewer/          # Reviewer pages
│   │   │       ├── ReviewerDashboard.jsx
│   │   │       ├── AssignedIdeas.jsx
│   │   │       ├── ReviewIdea.jsx
│   │   │       └── ReviewHistory.jsx
│   │   ├── routes/                # Route components
│   │   │   ├── AdminRoutes.jsx
│   │   │   ├── InnovatorRoutes.jsx
│   │   │   └── ReviewerRoutes.jsx
│   │   ├── services/
│   │   │   ├── api.js             # API service layer
│   │   │   └── socket.js          # Socket.IO client
│   │   ├── App.jsx                # Main app component
│   │   ├── main.jsx               # Entry point
│   │   └── index.css              # Global styles
│   ├── .env                       # Environment variables
│   └── package.json
├── API_TESTING_GUIDE.md           # Comprehensive API documentation
├── postman_collection.json        # Postman collection for testing
└── README.md                      # This file
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile

### Ideas
- `POST /api/ideas` - Submit new idea (Innovator)
- `GET /api/ideas` - Get all ideas (Admin)
- `GET /api/ideas/my` - Get my ideas (Innovator)
- `GET /api/ideas/assigned` - Get assigned ideas (Reviewer)
- `GET /api/ideas/:id` - Get idea by ID
- `PUT /api/ideas/:id/assign` - Assign reviewer (Admin)
- `PUT /api/ideas/:id/status` - Update idea status (Admin/Reviewer)
- `GET /api/ideas/stats` - Get idea statistics (Admin)

### Reviews
- `POST /api/reviews` - Submit review (Reviewer)
- `GET /api/reviews/idea/:ideaId` - Get reviews for an idea
- `GET /api/reviews/history` - Get review history (Reviewer)

### Users
- `GET /api/users` - Get all users (Admin)
- `GET /api/users/role/:role` - Get users by role (Admin)
- `GET /api/users/:id` - Get user by ID

### Notifications
- `GET /api/notifications` - Get all notifications
- `GET /api/notifications/unread-count` - Get unread count
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read

### Reports
- `GET /api/reports/analytics` - Get analytics data (Admin)

## 🧪 Testing

### Using Postman
1. Import `postman_collection.json` into Postman
2. Set up environment variables:
   - `base_url`: http://localhost:5004/api
   - `admin_token`, `reviewer_token`, `innovator_token` (auto-populated after login)
3. Run the requests in order as documented in `API_TESTING_GUIDE.md`

### Manual Testing Flow
1. **Register users**: Create admin, reviewer, and innovator accounts
2. **Login**: Authenticate as each role and save tokens
3. **Innovator**: Submit ideas and view your submissions
4. **Admin**: View all ideas, assign reviewers
5. **Reviewer**: Review assigned ideas and provide feedback
6. **Verify**: Check real-time notifications and analytics

## 🗄️ Database Schema

### Users
- `user_id` (Primary Key)
- `name`, `email`, `password` (hashed), `role`
- `created_at`

### Ideas
- `idea_id` (Primary Key)
- `title`, `description`, `domain`, `status`
- `innovator_id` (Foreign Key → Users)
- `reviewer_id` (Foreign Key → Users, nullable)
- `created_at`, `updated_at`

### Reviews
- `review_id` (Primary Key)
- `idea_id` (Foreign Key → Ideas)
- `reviewer_id` (Foreign Key → Users)
- `innovation_score`, `feasibility_score`, `impact_score`
- `feedback`
- `created_at`

### Notifications
- `notification_id` (Primary Key)
- `user_id` (Foreign Key → Users)
- `message`, `is_read`
- `created_at`

## 🎯 User Workflows

### Innovator Workflow
1. Register/Login as innovator
2. Submit new idea with title, description, and domain
3. View submitted ideas with status updates
4. Receive notifications when reviewer is assigned
5. View feedback and scores from reviewers

### Admin Workflow
1. Register/Login as admin
2. View all submitted ideas
3. Assign reviewers to ideas
4. Update idea statuses
5. View analytics and reports
6. Manage users

### Reviewer Workflow
1. Register/Login as reviewer
2. View assigned ideas
3. Review ideas with innovation, feasibility, and impact scores
4. Provide detailed feedback
5. Submit decision (Approved/Rejected/Needs Revision)
6. View review history

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds for secure password storage
- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Endpoint protection based on user roles
- **Input Validation**: Joi schemas validate all user inputs
- **HTTP Security Headers**: Helmet middleware protection
- **CORS**: Configured to allow only specific origins
- **Request Logging**: Morgan logs all requests for monitoring
- **Error Handling**: Centralized error handling with appropriate status codes

## 🌐 Real-Time Features

The application uses Socket.IO for real-time updates:
- New idea submissions notify admins
- Reviewer assignments notify both reviewer and innovator
- Review submissions notify innovators
- Status changes trigger instant UI updates

## 📊 State Management

- **React Context API** for global state management
- **AppContext**: Authentication, user data, toast notifications
- **RealTimeContext**: WebSocket connection management
- Local storage persistence for authentication tokens

## 🎨 UI/UX Features

- Responsive design with Tailwind CSS
- Role-based navigation and dashboards
- Real-time toast notifications
- Loading states and error handling
- Interactive charts and analytics (Recharts)
- Clean and modern interface

## 🚦 Environment Variables

### Server (.env)
```env
PORT=5004
DATABASE_URL="file:./dev.db"
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h
CLIENT_URL=http://localhost:5173
```

### Client (.env)
```env
VITE_API_URL=http://localhost:5004
```

## 📝 Scripts

### Server
```bash
npm start           # Start production server
npm run dev         # Start development server with nodemon
npm run prisma:generate   # Generate Prisma client
npm run prisma:migrate    # Run database migrations
npm run prisma:seed       # Seed database with test data
```

### Client
```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build
```

## 🐛 Troubleshooting

### Database Issues
```bash
cd server
npx prisma migrate reset  # Reset database
npx prisma generate       # Regenerate Prisma client
npx prisma db seed        # Reseed data
```

### Port Conflicts
If ports 5004 or 5173 are in use, update:
- Backend: Change `PORT` in `server/.env`
- Frontend: Change port in `client/vite.config.js`

### CORS Errors
Ensure `CLIENT_URL` in `server/.env` matches your frontend URL

## 📚 Additional Documentation

- **API Testing Guide**: See [API_TESTING_GUIDE.md](API_TESTING_GUIDE.md) for detailed API documentation
- **Postman Collection**: Import [postman_collection.json](postman_collection.json) for ready-to-use API tests

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

This project is licensed under the ISC License.

## 👥 Contact

For questions or support, please contact the development team.

---

**Built with ❤️ using React, Node.js, and Prisma**

A full-stack web application for managing, reviewing, and tracking innovative ideas within an organization. Built with React (frontend) and Node.js/Express/SQLite (backend).

## 🚀 Features

### For Innovators
- **Submit Ideas**: Submit detailed innovation proposals with domain classification
- **Track Progress**: Monitor idea status through the review pipeline  
- **View Feedback**: Receive detailed reviewer feedback and scores

### For Reviewers
- **Evaluate Ideas**: Score ideas on innovation, feasibility, and impact (1-10 scale)
- **Provide Feedback**: Give detailed written feedback to innovators
- **Review Dashboard**: Track assigned ideas and review history

### For Administrators
- **Manage System**: Oversee all submitted ideas and user activities
- **Assign Reviewers**: Match reviewers with ideas based on expertise
- **View Analytics**: Monitor trends, approval rates, and domain distributions

## 🛠 Technology Stack

### Frontend
- **React 19** with Vite
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Recharts** for data visualization
- **Axios** for API communication
- **Lucide React** for icons

### Backend
- **Node.js** with Express.js
- **SQLite** database with Prisma ORM
- **JWT** authentication
- **bcrypt** for password hashing
- **CORS** enabled for cross-origin requests

### Architecture
- **Layered Architecture** following SOLID principles
- Separate layers: Routes → Controllers → Services → Repositories
- Clean separation of concerns and dependency injection

## 📁 Project Structure

```
Innovation-Tracking-System/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service layer
│   │   ├── context/        # React context (auth)
│   │   └── routes/         # Route components
│   ├── package.json
│   └── vite.config.js
├── server/                 # Node.js backend  
│   ├── src/
│   │   ├── controllers/    # HTTP request handlers
│   │   ├── services/       # Business logic
│   │   ├── repositories/   # Data access layer
│   │   ├── routes/         # API route definitions
│   │   ├── middlewares/    # Auth & validation
│   │   └── config/         # Database config
│   ├── prisma/            # Database schema & migrations
│   │   ├── schema.prisma
│   │   └── seed.js
│   └── package.json
└── README.md
```

## 🗄️ Database Design

### Core Entities
- **Users**: Innovators, Reviewers, Admins with role-based access
- **Ideas**: Innovation proposals with status tracking
- **Reviews**: Evaluation scores and feedback from reviewers
- **Notifications**: Real-time updates for users

### Schema (SQLite)
```sql
Users (id, name, email, password, role, created_at)
Ideas (id, title, description, domain, status, innovator_id, reviewer_id, created_at)
Reviews (id, idea_id, reviewer_id, innovation_score, feasibility_score, impact_score, feedback)
Notifications (id, user_id, message, is_read, created_at)
```

## 🚦 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration  
- `GET /api/auth/me` - Get current user

### Ideas Management
- `GET /api/ideas` - Get all ideas (Admin)
- `POST /api/ideas` - Submit new idea (Innovator)
- `GET /api/ideas/my` - Get user's ideas (Innovator)
- `GET /api/ideas/assigned` - Get assigned ideas (Reviewer)
- `PUT /api/ideas/:id/assign` - Assign reviewer (Admin)
- `PUT /api/ideas/:id/status` - Update status

### Reviews
- `POST /api/reviews` - Submit review (Reviewer)
- `GET /api/reviews/history` - Review history (Reviewer)
- `GET /api/reviews/idea/:id` - Get idea reviews

### Analytics & Reports
- `GET /api/reports/analytics` - System analytics (Admin)

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Innovation-Tracking-System
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   
   # Configure environment variables
   cp .env.example .env
   # Edit .env with your database URL and JWT secret
   
   # Run database migrations and seed
   npx prisma migrate dev
   npx prisma db seed
   
   # Start development server
   npm run dev
   ```

4. **Frontend Setup**
   ```bash
   cd ../client
   npm install
   
   # Configure environment variables
   cp .env.example .env
   # Edit .env with API URL (default: http://localhost:5000)
   
   # Start development server
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Demo Accounts
Use these credentials to test different roles (password: `password123`):

- **Admin**: admin@example.com
- **Reviewer**: sarah.m@example.com or john.d@example.com  
- **Innovator**: alice@example.com, bob@example.com, etc.

## 🔄 Workflow

1. **Idea Submission**: Innovators submit ideas with title, description, and domain
2. **Administrative Assignment**: Admins assign expert reviewers based on domain knowledge
3. **Evaluation**: Reviewers score ideas (1-10) on innovation, feasibility, and impact
4. **Decision**: Ideas are approved, rejected, or sent back for improvement
5. **Tracking**: All stakeholders monitor progress through status updates
6. **Analytics**: Administrators view system-wide trends and performance metrics

## 🛡️ Security Features

- **JWT Authentication** with secure token handling
- **Password Hashing** using bcrypt with salt rounds
- **Role-Based Access Control** at route and UI level
- **Input Validation** on both client and server
- **CORS Protection** for cross-origin requests

## 📊 Key Metrics Tracked

- Total ideas submitted
- Approval vs rejection rates  
- Domain distribution of innovations
- Reviewer workload and performance
- Time-to-review metrics
- Top-rated ideas and trends

## 🎯 Future Enhancements

- [ ] Real-time notifications with WebSocket
- [ ] File attachment support for idea submissions
- [ ] Advanced analytics with machine learning insights
- [ ] Integration with collaboration tools (Slack, Teams)
- [ ] Mobile-responsive progressive web app
- [ ] Multi-language internationalization support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License. See LICENSE file for details.

## 📧 Support

For support and questions, please open an issue in the GitHub repository or contact the development team.

---

**Built with ❤️ for organizational innovation management**