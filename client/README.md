# Innovation Tracking System

A comprehensive, role-based Innovation Tracking System built with React.js, Tailwind CSS, and Recharts. This enterprise-grade application allows organizations to collect, evaluate, monitor, and analyze innovative ideas submitted by users.

## 🚀 Features

### Three Role-Based Modules:

#### 1️⃣ **Innovator Module**
- Submit innovative ideas with detailed information
- Track idea status in real-time
- View reviewer feedback and scores
- Timeline visualization of idea lifecycle
- Filter and search through submitted ideas

#### 2️⃣ **Reviewer Module**
- View assigned ideas for evaluation
- Score ideas on Innovation, Feasibility, and Impact (1-10 scale)
- Provide structured feedback
- Approve, Reject, or Request Improvements
- Review history and analytics

#### 3️⃣ **Admin Module**
- System-wide dashboard with key metrics
- Manage all ideas across the platform
- Assign reviewers to submitted ideas
- Override statuses when needed
- Comprehensive analytics with charts:
  - Ideas by domain (Bar Chart)
  - Status distribution (Pie Chart)
  - Top-rated ideas ranking
- Reviewer workload management

## 🛠️ Tech Stack

- **Frontend Framework:** React.js (Vite)
- **Styling:** Tailwind CSS
- **Routing:** React Router v6
- **Charts:** Recharts
- **Icons:** Lucide React
- **State Management:** Context API
- **Data Storage:** LocalStorage (mock backend)

## 📦 Installation

1. **Clone the repository:**
```bash
git clone https://github.com/JEEVITHA2855/Innovation-Tracking-System.git
cd Innovation-Tracking-System
```

2. **Install dependencies:**
```bash
npm install
```

3. **Run the development server:**
```bash
npm run dev
```

4. **Open your browser:**
Navigate to `http://localhost:3000`

## 🎯 Quick Start

1. On the landing page, select a role:
   - **Innovator** - Submit and track ideas
   - **Reviewer** - Evaluate submitted ideas
   - **Admin** - Manage system and analytics

2. Each role has pre-populated mock data to explore

3. All data is stored in LocalStorage, so changes persist across sessions

## 📁 Project Structure

```
src/
├── components/
│   ├── common/          # Reusable components
│   │   ├── Card.jsx
│   │   ├── Modal.jsx
│   │   ├── Table.jsx
│   │   ├── StatusBadge.jsx
│   │   ├── Loading.jsx
│   │   ├── Toast.jsx
│   │   ├── Sidebar.jsx
│   │   └── Layout.jsx
├── pages/
│   ├── innovator/       # Innovator module pages
│   │   ├── InnovatorDashboard.jsx
│   │   ├── MyIdeas.jsx
│   │   ├── SubmitIdea.jsx
│   │   └── IdeaDetails.jsx
│   ├── reviewer/        # Reviewer module pages
│   │   ├── ReviewerDashboard.jsx
│   │   ├── AssignedIdeas.jsx
│   │   ├── ReviewIdea.jsx
│   │   └── ReviewHistory.jsx
│   ├── admin/           # Admin module pages
│   │   ├── AdminDashboard.jsx
│   │   ├── AllIdeas.jsx
│   │   ├── ManageReviewers.jsx
│   │   └── Analytics.jsx
│   └── RoleSelection.jsx
├── routes/              # Route configurations
│   ├── InnovatorRoutes.jsx
│   ├── ReviewerRoutes.jsx
│   └── AdminRoutes.jsx
├── services/            # API services
│   └── api.js
├── context/             # React Context
│   └── AppContext.jsx
├── mock/                # Mock data
│   └── data.js
├── App.jsx
└── main.jsx
```

## 🎨 Key Features Implemented

### UI/UX
- ✅ Clean, enterprise-style dashboard layout
- ✅ Responsive design (desktop-first)
- ✅ Color-coded status badges
- ✅ Sidebar navigation
- ✅ Toast notifications
- ✅ Modal dialogs
- ✅ Loading states
- ✅ Empty states
- ✅ Smooth animations

### Functionality
- ✅ Role-based authentication
- ✅ Protected routes
- ✅ Idea submission form with validation
- ✅ Review evaluation system
- ✅ Reviewer assignment
- ✅ Status management
- ✅ Filtering and sorting
- ✅ Mock API with async behavior
- ✅ LocalStorage persistence

### Analytics
- ✅ Interactive bar charts
- ✅ Pie charts for distribution
- ✅ Top-rated ideas ranking
- ✅ Real-time statistics
- ✅ Reviewer workload tracking

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server

# Production
npm run build        # Build for production
npm run preview      # Preview production build
```

## 🌟 Mock Users

The system comes with pre-configured users:

**Innovators:**
- Alice Johnson (alice@example.com)
- Bob Smith (bob@example.com)
- Carol White (carol@example.com)
- David Brown (david@example.com)
- Emma Wilson (emma@example.com)

**Reviewers:**
- Dr. Sarah Miller (sarah.m@example.com)
- Prof. John Davis (john.d@example.com)

**Admin:**
- Admin User (admin@example.com)

## 📊 Innovation Domains

- AI (Artificial Intelligence)
- Web Development
- FinTech
- Healthcare
- Sustainability
- IoT (Internet of Things)
- Data Science
- Cybersecurity
- EdTech
- Other

## 🎯 Status Workflow

1. **Submitted** → New idea submitted
2. **Under Review** → Assigned to reviewer
3. **Approved** → Accepted for implementation
4. **Rejected** → Not accepted
5. **Needs Improvement** → Requires modifications

## 🚀 Future Enhancements

- Backend API integration
- User authentication system
- Real-time notifications
- File upload functionality
- Email notifications
- Advanced search and filters
- Export to PDF/Excel
- Role management system
- Commenting system
- Version control for ideas

## 📄 License

This project is open source and available under the MIT License.

## 👥 Contributors

Built as a demonstration of enterprise-level React.js application development.

## 🤝 Support

For issues or questions, please open an issue in the GitHub repository.

---

**Built with ❤️ using React.js, Tailwind CSS, and modern web technologies**
