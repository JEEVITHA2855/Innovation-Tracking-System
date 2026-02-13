import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from '../components/common/Layout'
import InnovatorDashboard from '../pages/innovator/InnovatorDashboard'
import MyIdeas from '../pages/innovator/MyIdeas'
import SubmitIdea from '../pages/innovator/SubmitIdea'
import IdeaDetails from '../pages/innovator/IdeaDetails'

const InnovatorRoutes = () => {
  const links = [
    { path: '/innovator', label: 'Dashboard', icon: 'dashboard' },
    { path: '/innovator/my-ideas', label: 'My Ideas', icon: 'ideas' },
    { path: '/innovator/submit', label: 'Submit Idea', icon: 'ideas' }
  ]

  return (
    <Layout links={links}>
      <Routes>
        <Route path="/" element={<InnovatorDashboard />} />
        <Route path="/my-ideas" element={<MyIdeas />} />
        <Route path="/submit" element={<SubmitIdea />} />
        <Route path="/idea/:id" element={<IdeaDetails />} />
        <Route path="*" element={<Navigate to="/innovator" />} />
      </Routes>
    </Layout>
  )
}

export default InnovatorRoutes
