import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ideasService } from '../../services/api'
import Card from '../../components/common/Card'
import StatusBadge from '../../components/common/StatusBadge'
import Loading from '../../components/common/Loading'
import { ArrowLeft, Calendar, User, TrendingUp } from 'lucide-react'

const IdeaDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [idea, setIdea] = useState(null)

  useEffect(() => {
    loadIdea()
  }, [id])

  const loadIdea = async () => {
    try {
      setLoading(true)
      const data = await ideasService.getById(id)
      setIdea(data)
    } catch (error) {
      console.error('Error loading idea:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <Loading />
  }

  if (!idea) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Idea not found</p>
        <button onClick={() => navigate('/innovator/my-ideas')} className="btn-primary mt-4">
          Back to My Ideas
        </button>
      </div>
    )
  }

  return (
    <div>
      <button
        onClick={() => navigate('/innovator/my-ideas')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to My Ideas
      </button>

      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{idea.title}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {idea.submittedDate}
            </span>
            <span className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              {idea.domain}
            </span>
            {idea.reviewerName && (
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {idea.reviewerName}
              </span>
            )}
          </div>
        </div>
        <StatusBadge status={idea.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card title="Problem Statement">
            <p className="text-gray-700 leading-relaxed">{idea.problemStatement}</p>
          </Card>

          <Card title="Proposed Solution">
            <p className="text-gray-700 leading-relaxed">{idea.proposedSolution}</p>
          </Card>

          <Card title="Expected Impact">
            <p className="text-gray-700 leading-relaxed">{idea.expectedImpact}</p>
          </Card>

          {/* Feedback */}
          {idea.feedback && (
            <Card title="Reviewer Feedback">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <p className="text-gray-700 leading-relaxed">{idea.feedback}</p>
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Scores */}
          {idea.scores && (
            <Card title="Evaluation Scores">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Innovation</span>
                    <span className="text-sm font-bold text-gray-900">{idea.scores.innovation}/10</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full"
                      style={{ width: `${idea.scores.innovation * 10}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Feasibility</span>
                    <span className="text-sm font-bold text-gray-900">{idea.scores.feasibility}/10</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${idea.scores.feasibility * 10}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Impact</span>
                    <span className="text-sm font-bold text-gray-900">{idea.scores.impact}/10</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: `${idea.scores.impact * 10}%` }}
                    ></div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">Overall Score</span>
                    <span className="text-lg font-bold text-gray-900">
                      {((idea.scores.innovation + idea.scores.feasibility + idea.scores.impact) / 3).toFixed(1)}/10
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Timeline */}
          <Card title="Idea Timeline">
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
                  <div className="w-0.5 h-full bg-gray-200"></div>
                </div>
                <div className="pb-4">
                  <p className="font-medium text-gray-900">Submitted</p>
                  <p className="text-sm text-gray-500">{idea.submittedDate}</p>
                </div>
              </div>

              {idea.status !== 'Submitted' && (
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full ${
                      ['Under Review', 'Approved', 'Rejected', 'Needs Improvement'].includes(idea.status)
                        ? 'bg-primary-600'
                        : 'bg-gray-300'
                    }`}></div>
                    {idea.status !== 'Under Review' && (
                      <div className="w-0.5 h-full bg-gray-200"></div>
                    )}
                  </div>
                  <div className="pb-4">
                    <p className="font-medium text-gray-900">{idea.status}</p>
                    <p className="text-sm text-gray-500">Current status</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default IdeaDetails
