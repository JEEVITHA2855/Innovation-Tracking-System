import React, { useState, useEffect } from 'react'
import { useApp } from '../../context/AppContext'
import { ideasService } from '../../services/api'
import Card from '../../components/common/Card'
import Loading from '../../components/common/Loading'
import { FileCheck, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const ReviewerDashboard = () => {
  const { currentUser } = useApp()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [ideas, setIdeas] = useState([])
  const [stats, setStats] = useState({
    assigned: 0,
    pending: 0,
    reviewed: 0,
    avgScore: 0
  })

  useEffect(() => {
    loadData()
  }, [currentUser])

  const loadData = async () => {
    try {
      setLoading(true)
      const assignedIdeas = await ideasService.getByReviewer(currentUser.id)
      setIdeas(assignedIdeas)
      
      const reviewed = assignedIdeas.filter(i => i.scores !== null)
      const avgScore = reviewed.length > 0
        ? reviewed.reduce((sum, idea) => {
            const total = (idea.scores.innovation + idea.scores.feasibility + idea.scores.impact) / 3
            return sum + total
          }, 0) / reviewed.length
        : 0

      setStats({
        assigned: assignedIdeas.length,
        pending: assignedIdeas.filter(i => i.status === 'Under Review' || i.status === 'Submitted').length,
        reviewed: reviewed.length,
        avgScore: avgScore.toFixed(1)
      })
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Assigned Ideas',
      value: stats.assigned,
      icon: FileCheck,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Pending Review',
      value: stats.pending,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Reviewed',
      value: stats.reviewed,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Avg Score',
      value: stats.avgScore,
      icon: AlertCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ]

  if (loading) {
    return <Loading />
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome, {currentUser.name}!</h1>
        <p className="text-gray-600 mt-2">Review and evaluate innovative ideas</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Pending Reviews */}
      <Card title="Pending Reviews">
        {ideas.filter(i => !i.scores).length > 0 ? (
          <div className="space-y-4">
            {ideas.filter(i => !i.scores).slice(0, 5).map((idea) => (
              <div
                key={idea.id}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{idea.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{idea.problemStatement.substring(0, 120)}...</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="font-medium text-primary-600">{idea.domain}</span>
                      <span>•</span>
                      <span>By {idea.innovatorName}</span>
                      <span>•</span>
                      <span>{idea.submittedDate}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/reviewer/review/${idea.id}`)}
                  className="btn-primary w-full mt-3"
                >
                  Review Now
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No pending reviews</p>
          </div>
        )}
      </Card>
    </div>
  )
}

export default ReviewerDashboard
