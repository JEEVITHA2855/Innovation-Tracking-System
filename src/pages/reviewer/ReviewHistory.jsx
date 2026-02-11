import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { ideasService } from '../../services/api'
import Card from '../../components/common/Card'
import Table from '../../components/common/Table'
import Loading from '../../components/common/Loading'
import StatusBadge from '../../components/common/StatusBadge'
import { Eye } from 'lucide-react'

const ReviewHistory = () => {
  const navigate = useNavigate()
  const { currentUser } = useApp()
  const [loading, setLoading] = useState(true)
  const [reviewedIdeas, setReviewedIdeas] = useState([])

  useEffect(() => {
    loadHistory()
  }, [currentUser])

  const loadHistory = async () => {
    try {
      setLoading(true)
      const assignedIdeas = await ideasService.getByReviewer(currentUser.id)
      const reviewed = assignedIdeas.filter(idea => idea.scores !== null)
      setReviewedIdeas(reviewed)
    } catch (error) {
      console.error('Error loading history:', error)
    } finally {
      setLoading(false)
    }
  }

  const headers = ['Idea', 'Innovator', 'Domain', 'Scores', 'Status', 'Actions']

  const renderRow = (idea, index) => (
    <tr key={idea.id} className="hover:bg-gray-50">
      <td className="px-6 py-4">
        <div>
          <p className="font-medium text-gray-900">{idea.title}</p>
          <p className="text-sm text-gray-500">{idea.submittedDate}</p>
        </div>
      </td>
      <td className="px-6 py-4 text-gray-700">{idea.innovatorName}</td>
      <td className="px-6 py-4">
        <span className="px-2 py-1 bg-primary-100 text-primary-800 rounded text-xs font-medium">
          {idea.domain}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex gap-2 text-sm">
          <span className="font-medium">I: {idea.scores.innovation}</span>
          <span className="font-medium">F: {idea.scores.feasibility}</span>
          <span className="font-medium">P: {idea.scores.impact}</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Avg: {((idea.scores.innovation + idea.scores.feasibility + idea.scores.impact) / 3).toFixed(1)}
        </p>
      </td>
      <td className="px-6 py-4">
        <StatusBadge status={idea.status} />
      </td>
      <td className="px-6 py-4">
        <button
          onClick={() => navigate(`/reviewer/review/${idea.id}`)}
          className="text-primary-600 hover:text-primary-700 flex items-center gap-1"
        >
          <Eye className="w-4 h-4" />
          View
        </button>
      </td>
    </tr>
  )

  if (loading) {
    return <Loading />
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Review History</h1>
        <p className="text-gray-600 mt-2">View all your previously reviewed ideas</p>
      </div>

      <Card>
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Total Reviewed: <span className="font-semibold text-gray-900">{reviewedIdeas.length}</span>
          </p>
        </div>
        <Table
          headers={headers}
          data={reviewedIdeas}
          renderRow={renderRow}
          emptyMessage="No review history available"
        />
      </Card>
    </div>
  )
}

export default ReviewHistory
