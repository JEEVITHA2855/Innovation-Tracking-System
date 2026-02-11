import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from '../components/common/Layout'
import AdminDashboard from '../pages/admin/AdminDashboard'
import AllIdeas from '../pages/admin/AllIdeas'
import Analytics from '../pages/admin/Analytics'
import ManageReviewers from '../pages/admin/ManageReviewers'

const AdminRoutes = () => {
  const links = [
    { path: '/admin', label: 'Dashboard', icon: 'dashboard' },
    { path: '/admin/ideas', label: 'All Ideas', icon: 'ideas' },
    { path: '/admin/reviewers', label: 'Reviewers', icon: 'users' },
    { path: '/admin/analytics', label: 'Analytics', icon: 'analytics' }
  ]

  return (
    <Layout links={links}>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/ideas" element={<AllIdeas />} />
        <Route path="/reviewers" element={<ManageReviewers />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="*" element={<Navigate to="/admin" />} />
      </Routes>
    </Layout>
  )
}

export default AdminRoutes
