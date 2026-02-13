import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { ideasAPI } from '../../services/api'
import Card from '../../components/common/Card'
import StatusBadge from '../../components/common/StatusBadge'
import Loading from '../../components/common/Loading'
import { Lightbulb, CheckCircle, Clock, AlertTriangle, PlusCircle } from 'lucide-react'

const statusMap = {
  'Submitted': 'Submitted',
  'Under_Review': 'Under Review',
  'Approved': 'Approved',
  'Rejected': 'Rejected',
  'Needs_Improvement': 'Needs Improvement'
}

const InnovatorDashboard = () => {
  const { currentUser } = useApp()
  const navigate = useNavigate()
  const [ideas, setIdeas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadIdeas()
  }, [])

  const loadIdeas = async () => {
    try {
      const res = await ideasAPI.getMyIdeas()
      setIdeas(res.data.data)
    } catch (err) {
      console.error('Failed to load ideas:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loading />

  const counts = {
    total: ideas.length,
    approved: ideas.filter(i => i.status === 'Approved').length,
    underReview: ideas.filter(i => i.status === 'Under_Review').length,
    pending: ideas.filter(i => i.status === 'Submitted').length,
  }

  const recentIdeas = ideas.slice(0, 5)

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {currentUser?.name}</h1>
          <p className="text-gray-600 mt-2">Track your innovations</p>
        </div>
        <button onClick={() => navigate('/innovator/submit')} className="btn-primary flex items-center gap-2">
          <PlusCircle className="w-5 h-5" />
          Submit New Idea
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Ideas', value: counts.total, icon: Lightbulb, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Approved', value: counts.approved, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Under Review', value: counts.underReview, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
          { label: 'Pending', value: counts.pending, icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-50' },
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

      <Card title="Recent Ideas" action={
        <button onClick={() => navigate('/innovator/my-ideas')} className="text-sm text-primary-600 hover:text-primary-700 font-medium">
          View all
        </button>
      }>
        {recentIdeas.length > 0 ? (
          <div className="space-y-4">
            {recentIdeas.map(idea => (
              <div
                key={idea.id}
                onClick={() => navigate(`/innovator/idea/${idea.id}`)}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
              >
                <div>
                  <p className="font-medium text-gray-900">{idea.title}</p>
                  <p className="text-sm text-gray-500 mt-1">{idea.domain} • {new Date(idea.createdAt).toLocaleDateString()}</p>
                </div>
                <StatusBadge status={statusMap[idea.status] || idea.status} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Lightbulb className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>You haven't submitted any ideas yet.</p>
            <button onClick={() => navigate('/innovator/submit')} className="btn-primary mt-4">
              Submit Your First Idea
            </button>
          </div>
        )}
      </Card>
    </div>
  )
}

export default InnovatorDashboard
