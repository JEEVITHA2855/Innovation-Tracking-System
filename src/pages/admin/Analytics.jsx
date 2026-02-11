import React, { useState, useEffect } from 'react'
import { ideasService } from '../../services/api'
import Card from '../../components/common/Card'
import Loading from '../../components/common/Loading'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const Analytics = () => {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [ideas, setIdeas] = useState([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [statsData, ideasData] = await Promise.all([
        ideasService.getStats(),
        ideasService.getAll()
      ])
      setStats(statsData)
      setIdeas(ideasData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <Loading />
  }

  // Prepare data for charts
  const domainData = Object.entries(stats.byDomain).map(([name, value]) => ({
    name,
    ideas: value
  }))

  const statusData = [
    { name: 'Approved', value: stats.approved, color: '#10b981' },
    { name: 'Under Review', value: stats.underReview, color: '#f59e0b' },
    { name: 'Needs Improvement', value: stats.needsImprovement, color: '#f97316' },
    { name: 'Rejected', value: stats.rejected, color: '#ef4444' },
    { name: 'Submitted', value: stats.submitted, color: '#3b82f6' }
  ].filter(item => item.value > 0)

  // Top rated ideas
  const topRatedIdeas = ideas
    .filter(idea => idea.scores)
    .map(idea => ({
      ...idea,
      avgScore: (idea.scores.innovation + idea.scores.feasibility + idea.scores.impact) / 3
    }))
    .sort((a, b) => b.avgScore - a.avgScore)
    .slice(0, 5)

  const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics & Insights</h1>
        <p className="text-gray-600 mt-2">Comprehensive data visualization and metrics</p>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Ideas by Domain Chart */}
        <Card title="Ideas by Innovation Domain">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={domainData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="ideas" fill="#0ea5e9" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Status Distribution Chart */}
        <Card title="Status Distribution">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Top Rated Ideas */}
      <Card title="Top Rated Ideas">
        <div className="space-y-4">
          {topRatedIdeas.length > 0 ? (
            topRatedIdeas.map((idea, index) => (
              <div key={idea.id} className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-center w-10 h-10 bg-primary-100 text-primary-700 font-bold rounded-full flex-shrink-0">
                  #{index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{idea.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{idea.domain} • by {idea.innovatorName}</p>
                  <div className="flex gap-4 text-sm">
                    <span className="text-gray-600">
                      Innovation: <span className="font-bold text-gray-900">{idea.scores.innovation}/10</span>
                    </span>
                    <span className="text-gray-600">
                      Feasibility: <span className="font-bold text-gray-900">{idea.scores.feasibility}/10</span>
                    </span>
                    <span className="text-gray-600">
                      Impact: <span className="font-bold text-gray-900">{idea.scores.impact}/10</span>
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Overall Score</p>
                  <p className="text-2xl font-bold text-primary-600">{idea.avgScore.toFixed(1)}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-8">No reviewed ideas yet</p>
          )}
        </div>
      </Card>

      {/* Key Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Total Submissions</p>
            <p className="text-4xl font-bold text-gray-900">{stats.total}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Approval Rate</p>
            <p className="text-4xl font-bold text-green-600">
              {stats.total > 0 ? ((stats.approved / stats.total) * 100).toFixed(1) : 0}%
            </p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Average Review Score</p>
            <p className="text-4xl font-bold text-purple-600">
              {topRatedIdeas.length > 0
                ? (topRatedIdeas.reduce((sum, idea) => sum + idea.avgScore, 0) / topRatedIdeas.length).toFixed(1)
                : 0}
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Analytics
