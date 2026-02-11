import React, { useState, useEffect } from 'react'
import { useApp } from '../../context/AppContext'
import { ideasService } from '../../services/api'
import Card from '../../components/common/Card'
import Loading from '../../components/common/Loading'
import StatusBadge from '../../components/common/StatusBadge'
import { TrendingUp, Clock, CheckCircle, XCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const InnovatorDashboard = () => {
  const { currentUser } = useApp()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [ideas, setIdeas] = useState([])
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    underReview: 0,
    rejected: 0
  })

  useEffect(() => {
    loadData()
  }, [currentUser])

  const loadData = async () => {
    try {
      setLoading(true)
      const userIdeas = await ideasService.getByInnovator(currentUser.id)
      setIdeas(userIdeas)
      
      setStats({
        total: userIdeas.length,
        approved: userIdeas.filter(i => i.status === 'Approved').length,
        underReview: userIdeas.filter(i => i.status === 'Under Review' || i.status === 'Submitted').length,
        rejected: userIdeas.filter(i => i.status === 'Rejected').length
      })
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Total Ideas',
      value: stats.total,
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Under Review',
      value: stats.underReview,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Approved',
      value: stats.approved,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Rejected',
      value: stats.rejected,
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  ]

  if (loading) {
    return <Loading />
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome, {currentUser.name}!</h1>
        <p className="text-gray-600 mt-2">Track and manage your innovative ideas</p>
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

      {/* Recent Ideas */}
      <Card title="Recent Ideas">
        {ideas.length > 0 ? (
          <div className="space-y-4">
            {ideas.slice(0, 5).map((idea) => (
              <div
                key={idea.id}
                onClick={() => navigate(`/innovator/idea/${idea.id}`)}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{idea.title}</h3>
                  <StatusBadge status={idea.status} />
                </div>
                <p className="text-sm text-gray-600 mb-2">{idea.domain}</p>
                <p className="text-xs text-gray-500">Submitted: {idea.submittedDate}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">You haven't submitted any ideas yet</p>
            <button 
              onClick={() => navigate('/innovator/submit')}
              className="btn-primary"
            >
              Submit Your First Idea
            </button>
          </div>
        )}
      </Card>
    </div>
  )
}

export default InnovatorDashboard
