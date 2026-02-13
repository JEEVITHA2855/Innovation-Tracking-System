import React, { useState, useEffect } from 'react'
import { reportsAPI } from '../../services/api'
import Card from '../../components/common/Card'
import Loading from '../../components/common/Loading'
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts'

const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4']

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    try {
      const res = await reportsAPI.getAnalytics()
      setAnalytics(res.data.data)
    } catch (err) {
      console.error('Failed to load analytics:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loading />
  if (!analytics) return <div className="text-center text-gray-500 p-8">No analytics data available</div>

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-2">Innovation insights and reporting</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Ideas', value: analytics.overview.totalIdeas, color: 'text-blue-600' },
          { label: 'Approved', value: analytics.overview.approved, color: 'text-green-600' },
          { label: 'Rejection Rate', value: `${analytics.overview.totalIdeas > 0 ? Math.round((analytics.overview.rejected / analytics.overview.totalIdeas) * 100) : 0}%`, color: 'text-red-600' },
          { label: 'Approval Rate', value: `${analytics.overview.approvalRate}%`, color: 'text-purple-600' },
        ].map((item, i) => (
          <Card key={i}>
            <p className="text-sm text-gray-600">{item.label}</p>
            <p className={`text-2xl font-bold mt-1 ${item.color}`}>{item.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Domain Distribution Chart */}
        <Card title="Ideas by Domain">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.domainDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="domain" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Status Distribution Pie Chart */}
        <Card title="Status Distribution">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.statusDistribution.filter(d => d.count > 0)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="status"
                >
                  {analytics.statusDistribution.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Top Rated Ideas */}
      <Card title="Top Rated Ideas">
        {analytics.topRatedIdeas?.length > 0 ? (
          <div className="space-y-4">
            {analytics.topRatedIdeas.map((idea, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-primary-600">#{index + 1}</span>
                  <div>
                    <p className="font-medium text-gray-900">{idea.title}</p>
                    <p className="text-sm text-gray-500">{idea.domain} • by {idea.innovator?.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="text-center">
                    <p className="text-gray-500">Innovation</p>
                    <p className="font-bold text-gray-900">{idea.innovationScore}/10</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500">Feasibility</p>
                    <p className="font-bold text-gray-900">{idea.feasibilityScore}/10</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500">Impact</p>
                    <p className="font-bold text-gray-900">{idea.impactScore}/10</p>
                  </div>
                  <div className="text-center border-l pl-4">
                    <p className="text-gray-500">Avg</p>
                    <p className="font-bold text-primary-600">{idea.avgScore}/10</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No reviewed ideas yet</p>
        )}
      </Card>
    </div>
  )
}

export default Analytics
