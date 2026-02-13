import React from 'react'
import { NavLink } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { 
  LayoutDashboard, 
  Lightbulb, 
  BarChart3, 
  Users, 
  LogOut,
  FileCheck,
  Settings
} from 'lucide-react'

const Sidebar = ({ links }) => {
  const { logout, currentUser } = useApp()

  const iconMap = {
    dashboard: LayoutDashboard,
    ideas: Lightbulb,
    analytics: BarChart3,
    users: Users,
    review: FileCheck,
    settings: Settings
  }

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-primary-600">Innovation Hub</h1>
        <p className="text-xs text-gray-500 mt-1">{currentUser?.role?.toUpperCase()}</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => {
          const Icon = iconMap[link.icon] || Lightbulb
          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span>{link.label}</span>
            </NavLink>
          )
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="mb-4 px-4">
          <p className="text-sm font-medium text-gray-900">{currentUser?.name}</p>
          <p className="text-xs text-gray-500">{currentUser?.email}</p>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 w-full transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}

export default Sidebar
