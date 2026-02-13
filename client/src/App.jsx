import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { useApp } from './context/AppContext'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Register from './pages/Register'
import InnovatorRoutes from './routes/InnovatorRoutes'
import ReviewerRoutes from './routes/ReviewerRoutes'
import AdminRoutes from './routes/AdminRoutes'
import Toast from './components/common/Toast'

function App() {
  const { currentUser } = useApp()

  return (
    <>
      <Routes>
        {!currentUser ? (
          // Public routes (when not logged in)
          <>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<LandingPage />} />
          </>
        ) : (
          // Protected routes (when logged in)
          <>
            <Route path="/innovator/*" element={<InnovatorRoutes />} />
            <Route path="/reviewer/*" element={<ReviewerRoutes />} />
            <Route path="/admin/*" element={<AdminRoutes />} />
            <Route path="*" element={
              currentUser.role === 'innovator' ? <InnovatorRoutes /> :
              currentUser.role === 'reviewer' ? <ReviewerRoutes /> :
              <AdminRoutes />
            } />
          </>
        )}
      </Routes>
      <Toast />
    </>
  )
}

export default App
