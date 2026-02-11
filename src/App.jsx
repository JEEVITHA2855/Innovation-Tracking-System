import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useApp } from './context/AppContext'
import RoleSelection from './pages/RoleSelection'
import InnovatorRoutes from './routes/InnovatorRoutes'
import ReviewerRoutes from './routes/ReviewerRoutes'
import AdminRoutes from './routes/AdminRoutes'

function App() {
  const { userRole } = useApp()

  return (
    <Routes>
      <Route path="/" element={<RoleSelection />} />
      <Route
        path="/innovator/*"
        element={userRole === 'innovator' ? <InnovatorRoutes /> : <Navigate to="/" />}
      />
      <Route
        path="/reviewer/*"
        element={userRole === 'reviewer' ? <ReviewerRoutes /> : <Navigate to="/" />}
      />
      <Route
        path="/admin/*"
        element={userRole === 'admin' ? <AdminRoutes /> : <Navigate to="/" />}
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default App
