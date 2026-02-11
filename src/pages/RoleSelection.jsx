import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { Lightbulb, Users as UsersIcon, Shield } from 'lucide-react'

const RoleSelection = () => {
  const navigate = useNavigate()
  const { selectRole } = useApp()

  const roles = [
    {
      id: 'innovator',
      title: 'Innovator',
      description: 'Submit and track your innovative ideas',
      icon: Lightbulb,
      color: 'bg-blue-500',
      path: '/innovator',
      mockUser: { id: 1, name: 'Alice Johnson', role: 'innovator', email: 'alice@example.com' }
    },
    {
      id: 'reviewer',
      title: 'Reviewer',
      description: 'Review and evaluate submitted ideas',
      icon: UsersIcon,
      color: 'bg-green-500',
      path: '/reviewer',
      mockUser: { id: 6, name: 'Dr. Sarah Miller', role: 'reviewer', email: 'sarah.m@example.com' }
    },
    {
      id: 'admin',
      title: 'Admin',
      description: 'Manage system, users, and analytics',
      icon: Shield,
      color: 'bg-purple-500',
      path: '/admin',
      mockUser: { id: 8, name: 'Admin User', role: 'admin', email: 'admin@example.com' }
    }
  ]

  const handleRoleSelect = (role) => {
    selectRole(role.id, role.mockUser)
    navigate(role.path)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Innovation Tracking System
          </h1>
          <p className="text-lg text-gray-600">
            Select your role to continue
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {roles.map((role) => {
            const Icon = role.icon
            return (
              <div
                key={role.id}
                onClick={() => handleRoleSelect(role)}
                className="bg-white rounded-xl shadow-lg p-8 cursor-pointer transform transition-all hover:scale-105 hover:shadow-xl"
              >
                <div className={`${role.color} w-16 h-16 rounded-full flex items-center justify-center mb-6`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  {role.title}
                </h2>
                <p className="text-gray-600 mb-6">
                  {role.description}
                </p>
                <button className="btn-primary w-full">
                  Continue as {role.title}
                </button>
              </div>
            )
          })}
        </div>

        <div className="mt-12 text-center text-sm text-gray-500">
          <p>This is a demo application. Select any role to explore the system.</p>
        </div>
      </div>
    </div>
  )
}

export default RoleSelection
