import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ideasAPI } from '../../services/api'
import Card from '../../components/common/Card'
import Loading from '../../components/common/Loading'
import { TrendingUp, CheckCircle, Clock, FileText, BarChart, Users } from 'lucide-react'

const AdminDashboard = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const res = await ideasAPI.getStats()
      setStats(res.data.data)
    } catch (err) {
      setError('Failed to load dashboard data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loading />
  if (error) return <div className="text-center text-red-500 p-8">{error}</div>
  if (!stats) return null

  const statCards = [
    { title: 'Total Ideas', value: stats.total, icon: FileText, color: 'text-blue-600', bgColor: 'bg-blue-50', change: '+12%' },
    { title: 'Under Review', value: stats.underReview, icon: Clock, color: 'text-yellow-600', bgColor: 'bg-yellow-50', change: '+5%' },
    { title: 'Approved', value: stats.approved, icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-50', change: '+8%' },
    { title: 'Approval Rate', value: stats.total > 0 ? `${((stats.approved / stats.total) * 100).toFixed(1)}%` : '0%', icon: TrendingUp, color: 'text-purple-600', bgColor: 'bg-purple-50', change: '+3%' }
  ]

  const topDomains = Object.entries(stats.byDomain || {}).sort((a, b) => b[1] - a[1]).slice(0, 5)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">System overview and analytics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-1">{stat.change} from last month</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card title="Status Distribution">
          <div className="space-y-4">
            {[
              { label: 'Approved', count: stats.approved, color: 'bg-green-500' },
              { label: 'Under Review', count: stats.underReview, color: 'bg-yellow-500' },
              { label: 'Needs Improvement', count: stats.needsImprovement, color: 'bg-orange-500' },
              { label: 'Rejected', count: stats.rejected, color: 'bg-red-500' },
              { label: 'Submitted', count: stats.submitted, color: 'bg-blue-500' },
            ].map(item => (
              <div key={item.label}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{item.label}</span>
                  <span className="text-sm font-bold text-gray-900">{item.count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className={`${item.color} h-3 rounded-full`}
                    style={{ width: `${stats.total > 0 ? (item.count / stats.total) * 100 : 0}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Top Innovation Domains">
          <div className="space-y-4">
            {topDomains.length > 0 ? topDomains.map(([domain, count], index) => (
              <div key={domain}>
                <div className="flex justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-400">#{index + 1}</span>
                    <span className="text-sm font-medium text-gray-700">{domain}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{count} ideas</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-primary-500 h-2 rounded-full"
                    style={{ width: `${(count / stats.total) * 100}%` }}></div>
                </div>
              </div>
            )) : (
              <p className="text-gray-500 text-sm">No domain data available</p>
            )}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <button onClick={() => navigate('/admin/ideas')} className="w-full text-left">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-blue-50 p-3 rounded-lg"><FileText className="w-6 h-6 text-blue-600" /></div>
              <h3 className="font-semibold text-gray-900">Manage Ideas</h3>
            </div>
            <p className="text-sm text-gray-600">View and manage all submitted ideas</p>
          </button>
        </Card>
        <Card>
          <button onClick={() => navigate('/admin/reviewers')} className="w-full text-left">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-green-50 p-3 rounded-lg"><Users className="w-6 h-6 text-green-600" /></div>
              <h3 className="font-semibold text-gray-900">Assign Reviewers</h3>
            </div>
            <p className="text-sm text-gray-600">Assign ideas to reviewers for evaluation</p>
          </button>
        </Card>
        <Card>
          <button onClick={() => navigate('/admin/analytics')} className="w-full text-left">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-purple-50 p-3 rounded-lg"><BarChart className="w-6 h-6 text-purple-600" /></div>
              <h3 className="font-semibold text-gray-900">View Analytics</h3>
            </div>
            <p className="text-sm text-gray-600">Detailed charts and insights</p>
          </button>
        </Card>
      </div>
    </div>
  )
}

export default AdminDashboard
