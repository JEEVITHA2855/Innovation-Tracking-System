import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from '../components/common/Layout'
import ReviewerDashboard from '../pages/reviewer/ReviewerDashboard'
import AssignedIdeas from '../pages/reviewer/AssignedIdeas'
import ReviewIdea from '../pages/reviewer/ReviewIdea'
import ReviewHistory from '../pages/reviewer/ReviewHistory'

const ReviewerRoutes = () => {
  const links = [
    { path: '/reviewer', label: 'Dashboard', icon: 'dashboard' },
    { path: '/reviewer/assigned', label: 'Assigned Ideas', icon: 'review' },
    { path: '/reviewer/history', label: 'Review History', icon: 'ideas' }
  ]

  return (
    <Layout links={links}>
      <Routes>
        <Route path="/" element={<ReviewerDashboard />} />
        <Route path="/assigned" element={<AssignedIdeas />} />
        <Route path="/review/:id" element={<ReviewIdea />} />
        <Route path="/history" element={<ReviewHistory />} />
        <Route path="*" element={<Navigate to="/reviewer" />} />
      </Routes>
    </Layout>
  )
}

export default ReviewerRoutes
