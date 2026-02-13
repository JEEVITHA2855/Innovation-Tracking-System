import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ideasAPI } from '../../services/api'
import Card from '../../components/common/Card'
import StatusBadge from '../../components/common/StatusBadge'
import Loading from '../../components/common/Loading'
import { ArrowLeft, Calendar, User, Star } from 'lucide-react'

const statusMap = {
  'Submitted': 'Submitted',
  'Under_Review': 'Under Review',
  'Approved': 'Approved',
  'Rejected': 'Rejected',
  'Needs_Improvement': 'Needs Improvement'
}

const IdeaDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [idea, setIdea] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadIdea()
  }, [id])

  const loadIdea = async () => {
    try {
      const res = await ideasAPI.getById(id)
      setIdea(res.data.data)
    } catch (err) {
      console.error('Failed to load idea:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loading />
  if (!idea) return <div className="text-center text-gray-500 p-8">Idea not found</div>

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="max-w-4xl">
        <Card>
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{idea.title}</h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(idea.createdAt).toLocaleDateString()}
                </span>
                <span className="px-2 py-1 bg-primary-50 text-primary-700 rounded text-xs font-medium">
                  {idea.domain}
                </span>
              </div>
            </div>
            <StatusBadge status={statusMap[idea.status] || idea.status} />
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
            <p className="text-gray-700 whitespace-pre-line">{idea.description}</p>
          </div>

          {idea.reviewer && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Assigned Reviewer</span>
              </div>
              <p className="text-gray-900 font-medium">{idea.reviewer.name}</p>
            </div>
          )}

          {/* Review Scores */}
          {idea.reviews?.length > 0 && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Scores</h3>
              {idea.reviews.map((review, idx) => (
                <div key={idx} className="mb-4">
                  <p className="text-sm text-gray-500 mb-3">
                    Reviewed by {review.reviewer?.name || 'Reviewer'} on {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    {[
                      { label: 'Innovation', score: review.innovationScore },
                      { label: 'Feasibility', score: review.feasibilityScore },
                      { label: 'Impact', score: review.impactScore },
                    ].map(({ label, score }) => (
                      <div key={label} className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="text-2xl font-bold text-gray-900">{score}</span>
                          <span className="text-gray-400">/10</span>
                        </div>
                        <p className="text-sm text-gray-600">{label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Feedback</h4>
                    <p className="text-gray-700">{review.feedback}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Status Timeline */}
          <div className="border-t pt-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Timeline</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <p className="text-sm text-gray-600">
                  Submitted on {new Date(idea.createdAt).toLocaleDateString()}
                </p>
              </div>
              {idea.reviewer && (
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <p className="text-sm text-gray-600">Assigned to {idea.reviewer.name} for review</p>
                </div>
              )}
              {idea.status !== 'Submitted' && idea.status !== 'Under_Review' && (
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    idea.status === 'Approved' ? 'bg-green-500' :
                    idea.status === 'Rejected' ? 'bg-red-500' : 'bg-orange-500'
                  }`}></div>
                  <p className="text-sm text-gray-600">
                    {statusMap[idea.status] || idea.status}
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default IdeaDetails
