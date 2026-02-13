import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { ideasAPI } from '../../services/api'
import Card from '../../components/common/Card'
import StatusBadge from '../../components/common/StatusBadge'
import Loading from '../../components/common/Loading'
import { FileCheck, Clock, CheckCircle, XCircle } from 'lucide-react'

const statusMap = {
  'Submitted': 'Submitted',
  'Under_Review': 'Under Review',
  'Approved': 'Approved',
  'Rejected': 'Rejected',
  'Needs_Improvement': 'Needs Improvement'
}

const ReviewerDashboard = () => {
  const { currentUser } = useApp()
  const navigate = useNavigate()
  const [ideas, setIdeas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadIdeas()
  }, [])

  const loadIdeas = async () => {
    try {
      const res = await ideasAPI.getAssigned()
      setIdeas(res.data.data)
    } catch (err) {
      console.error('Failed to load assigned ideas:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loading />

  const pending = ideas.filter(i => i.status === 'Under_Review')
  const reviewed = ideas.filter(i => ['Approved', 'Rejected', 'Needs_Improvement'].includes(i.status))

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome, {currentUser?.name}</h1>
        <p className="text-gray-600 mt-2">Review and evaluate assigned ideas</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Assigned', value: ideas.length, icon: FileCheck, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Pending Review', value: pending.length, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
          { label: 'Approved', value: ideas.filter(i => i.status === 'Approved').length, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Rejected', value: ideas.filter(i => i.status === 'Rejected').length, icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
        ].map((stat, i) => {
          const Icon = stat.icon
          return (
            <Card key={i}>
              <div className="flex items-center gap-4">
                <div className={`${stat.bg} p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <Card title="Pending Reviews" action={
        <button onClick={() => navigate('/reviewer/assigned')} className="text-sm text-primary-600 hover:text-primary-700 font-medium">
          View all
        </button>
      }>
        {pending.length > 0 ? (
          <div className="space-y-4">
            {pending.map(idea => (
              <div
                key={idea.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div>
                  <p className="font-medium text-gray-900">{idea.title}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {idea.domain} • by {idea.innovator?.name} • {new Date(idea.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => navigate(`/reviewer/review/${idea.id}`)}
                  className="btn-primary text-sm"
                >
                  Review
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm text-center py-4">No pending reviews</p>
        )}
      </Card>
    </div>
  )
}

export default ReviewerDashboard
