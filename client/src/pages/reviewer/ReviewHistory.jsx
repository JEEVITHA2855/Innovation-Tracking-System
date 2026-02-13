import React, { useState, useEffect } from 'react'
import { reviewsAPI } from '../../services/api'
import Card from '../../components/common/Card'
import Table from '../../components/common/Table'
import StatusBadge from '../../components/common/StatusBadge'
import Loading from '../../components/common/Loading'

const statusMap = {
  'Submitted': 'Submitted',
  'Under_Review': 'Under Review',
  'Approved': 'Approved',
  'Rejected': 'Rejected',
  'Needs_Improvement': 'Needs Improvement'
}

const ReviewHistory = () => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    try {
      const res = await reviewsAPI.getHistory()
      setReviews(res.data.data)
    } catch (err) {
      console.error('Failed to load review history:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loading />

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Review History</h1>
        <p className="text-gray-600 mt-2">All your past evaluations</p>
      </div>

      <Card>
        <Table
          headers={['Idea', 'Domain', 'Innovator', 'Innovation', 'Feasibility', 'Impact', 'Avg', 'Status', 'Date']}
          data={reviews}
          emptyMessage="No reviews yet"
          renderRow={(review) => {
            const avg = ((review.innovationScore + review.feasibilityScore + review.impactScore) / 3).toFixed(1)
            return (
              <tr key={review.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{review.idea?.title || '-'}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-primary-50 text-primary-700 rounded text-xs font-medium">
                    {review.idea?.domain}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{review.idea?.innovator?.name || '-'}</td>
                <td className="px-6 py-4 text-sm font-medium text-center">{review.innovationScore}/10</td>
                <td className="px-6 py-4 text-sm font-medium text-center">{review.feasibilityScore}/10</td>
                <td className="px-6 py-4 text-sm font-medium text-center">{review.impactScore}/10</td>
                <td className="px-6 py-4 text-sm font-bold text-primary-600 text-center">{avg}</td>
                <td className="px-6 py-4">
                  <StatusBadge status={statusMap[review.idea?.status] || review.idea?.status} />
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </td>
              </tr>
            )
          }}
        />
      </Card>
    </div>
  )
}

export default ReviewHistory
