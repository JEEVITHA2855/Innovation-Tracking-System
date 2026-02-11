import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ideasService } from '../../services/api'
import { useApp } from '../../context/AppContext'
import Card from '../../components/common/Card'
import Loading from '../../components/common/Loading'
import { ArrowLeft, Send, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

const ReviewIdea = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { showToast } = useApp()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [idea, setIdea] = useState(null)
  const [reviewData, setReviewData] = useState({
    scores: {
      innovation: 5,
      feasibility: 5,
      impact: 5
    },
    feedback: '',
    status: 'Approved'
  })

  useEffect(() => {
    loadIdea()
  }, [id])

  const loadIdea = async () => {
    try {
      setLoading(true)
      const data = await ideasService.getById(id)
      setIdea(data)
      
      // If already reviewed, populate form
      if (data.scores) {
        setReviewData({
          scores: data.scores,
          feedback: data.feedback || '',
          status: data.status
        })
      }
    } catch (error) {
      console.error('Error loading idea:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleScoreChange = (category, value) => {
    setReviewData(prev => ({
      ...prev,
      scores: {
        ...prev.scores,
        [category]: parseInt(value)
      }
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!reviewData.feedback.trim()) {
      showToast('Please provide feedback', 'error')
      return
    }

    try {
      setSubmitting(true)
      await ideasService.submitReview(id, reviewData)
      showToast('Review submitted successfully!', 'success')
      navigate('/reviewer/assigned')
    } catch (error) {
      showToast('Failed to submit review', 'error')
      console.error('Error submitting review:', error)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <Loading />
  }

  if (!idea) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Idea not found</p>
        <button onClick={() => navigate('/reviewer/assigned')} className="btn-primary mt-4">
          Back to Assigned Ideas
        </button>
      </div>
    )
  }

  const isAlreadyReviewed = idea.scores !== null
  const avgScore = (reviewData.scores.innovation + reviewData.scores.feasibility + reviewData.scores.impact) / 3

  return (
    <div>
      <button
        onClick={() => navigate('/reviewer/assigned')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Assigned Ideas
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {isAlreadyReviewed ? 'View Review' : 'Review Idea'}
        </h1>
        <p className="text-gray-600">Evaluate and provide feedback on this innovation</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card title="Idea Details">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{idea.title}</h2>
            
            <div className="mb-4">
              <h3 className="font-semibold text-gray-900 mb-2">Innovator</h3>
              <p className="text-gray-700">{idea.innovatorName}</p>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold text-gray-900 mb-2">Domain</h3>
              <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium">
                {idea.domain}
              </span>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold text-gray-900 mb-2">Problem Statement</h3>
              <p className="text-gray-700 leading-relaxed">{idea.problemStatement}</p>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold text-gray-900 mb-2">Proposed Solution</h3>
              <p className="text-gray-700 leading-relaxed">{idea.proposedSolution}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Expected Impact</h3>
              <p className="text-gray-700 leading-relaxed">{idea.expectedImpact}</p>
            </div>
          </Card>
        </div>

        {/* Review Form */}
        <div>
          <Card title="Evaluation">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Innovation Score */}
              <div>
                <label className="label">Innovation Score</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={reviewData.scores.innovation}
                    onChange={(e) => handleScoreChange('innovation', e.target.value)}
                    className="flex-1"
                    disabled={isAlreadyReviewed}
                  />
                  <span className="text-2xl font-bold text-gray-900 w-12 text-center">
                    {reviewData.scores.innovation}
                  </span>
                </div>
              </div>

              {/* Feasibility Score */}
              <div>
                <label className="label">Feasibility Score</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={reviewData.scores.feasibility}
                    onChange={(e) => handleScoreChange('feasibility', e.target.value)}
                    className="flex-1"
                    disabled={isAlreadyReviewed}
                  />
                  <span className="text-2xl font-bold text-gray-900 w-12 text-center">
                    {reviewData.scores.feasibility}
                  </span>
                </div>
              </div>

              {/* Impact Score */}
              <div>
                <label className="label">Impact Score</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={reviewData.scores.impact}
                    onChange={(e) => handleScoreChange('impact', e.target.value)}
                    className="flex-1"
                    disabled={isAlreadyReviewed}
                  />
                  <span className="text-2xl font-bold text-gray-900 w-12 text-center">
                    {reviewData.scores.impact}
                  </span>
                </div>
              </div>

              {/* Overall Score Display */}
              <div className="p-4 bg-primary-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Overall Score</p>
                <p className="text-3xl font-bold text-primary-600">{avgScore.toFixed(1)}/10</p>
              </div>

              {/* Decision */}
              {!isAlreadyReviewed && (
                <div>
                  <label className="label">Decision</label>
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => setReviewData(prev => ({ ...prev, status: 'Approved' }))}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                        reviewData.status === 'Approved'
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <CheckCircle className="w-5 h-5" />
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => setReviewData(prev => ({ ...prev, status: 'Needs Improvement' }))}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                        reviewData.status === 'Needs Improvement'
                          ? 'bg-yellow-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <AlertCircle className="w-5 h-5" />
                      Needs Improvement
                    </button>
                    <button
                      type="button"
                      onClick={() => setReviewData(prev => ({ ...prev, status: 'Rejected' }))}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                        reviewData.status === 'Rejected'
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <XCircle className="w-5 h-5" />
                      Reject
                    </button>
                  </div>
                </div>
              )}

              {/* Feedback */}
              <div>
                <label className="label">Feedback</label>
                <textarea
                  value={reviewData.feedback}
                  onChange={(e) => setReviewData(prev => ({ ...prev, feedback: e.target.value }))}
                  className="input-field"
                  rows="6"
                  placeholder="Provide detailed feedback for the innovator..."
                  disabled={isAlreadyReviewed}
                  required
                />
              </div>

              {/* Submit Button */}
              {!isAlreadyReviewed && (
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              )}
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default ReviewIdea
