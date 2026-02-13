# Innovation Tracking System

A full-stack web application for managing, reviewing, and tracking innovative ideas within an organization. Built with React (frontend) and Node.js/Express/PostgreSQL (backend).

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
- **PostgreSQL** database with Prisma ORM
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

### Schema (PostgreSQL)
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
- PostgreSQL 13+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Innovation-Tracking-System
   ```

2. **Setup Database**
   ```bash
   # Create PostgreSQL database
   createdb innovation_tracking
   ```

3. **Backend Setup**
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