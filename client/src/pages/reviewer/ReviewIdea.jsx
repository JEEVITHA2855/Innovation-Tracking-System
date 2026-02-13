import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { ideasAPI, reviewsAPI } from '../../services/api'
import Card from '../../components/common/Card'
import StatusBadge from '../../components/common/StatusBadge'
import Loading from '../../components/common/Loading'
import { ArrowLeft, Star, CheckCircle, XCircle, AlertTriangle, Loader2 } from 'lucide-react'

const statusMap = {
  'Submitted': 'Submitted',
  'Under_Review': 'Under Review',
  'Approved': 'Approved',
  'Rejected': 'Rejected',
  'Needs_Improvement': 'Needs Improvement'
}

const ReviewIdea = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { showToast } = useApp()
  const [idea, setIdea] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    innovationScore: 5,
    feasibilityScore: 5,
    impactScore: 5,
    feedback: ''
  })

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

  const handleSubmitReview = async (decision) => {
    if (!form.feedback.trim()) {
      showToast('Please provide feedback', 'error')
      return
    }

    setSubmitting(true)
    try {
      await reviewsAPI.create({
        ideaId: parseInt(id),
        innovationScore: form.innovationScore,
        feasibilityScore: form.feasibilityScore,
        impactScore: form.impactScore,
        feedback: form.feedback,
        decision
      })
      showToast(`Idea ${decision.replace('_', ' ').toLowerCase()} successfully!`, 'success')
      navigate('/reviewer/assigned')
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to submit review', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <Loading />
  if (!idea) return <div className="text-center text-gray-500 p-8">Idea not found</div>

  const isReviewable = idea.status === 'Under_Review'

  return (
    <div>
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4" />Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Idea Details */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{idea.title}</h1>
                <p className="text-sm text-gray-500 mt-2">
                  {idea.domain} • by {idea.innovator?.name} • {new Date(idea.createdAt).toLocaleDateString()}
                </p>
              </div>
              <StatusBadge status={statusMap[idea.status] || idea.status} />
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
              <p className="text-gray-700 whitespace-pre-line">{idea.description}</p>
            </div>

            {/* Past Reviews */}
            {idea.reviews?.length > 0 && (
              <div className="border-t pt-6">
                <h3 className="text-sm font-medium text-gray-500 mb-3">Previous Reviews</h3>
                {idea.reviews.map((review, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 rounded-lg mb-3">
                    <div className="flex gap-4 mb-2 text-sm">
                      <span>Innovation: <strong>{review.innovationScore}/10</strong></span>
                      <span>Feasibility: <strong>{review.feasibilityScore}/10</strong></span>
                      <span>Impact: <strong>{review.impactScore}/10</strong></span>
                    </div>
                    <p className="text-sm text-gray-600">{review.feedback}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Review Form */}
        <div>
          {isReviewable ? (
            <Card title="Submit Evaluation">
              <div className="space-y-6">
                {/* Score Sliders */}
                {[
                  { key: 'innovationScore', label: 'Innovation', color: 'text-blue-600' },
                  { key: 'feasibilityScore', label: 'Feasibility', color: 'text-green-600' },
                  { key: 'impactScore', label: 'Impact', color: 'text-purple-600' },
                ].map(({ key, label, color }) => (
                  <div key={key}>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">{label}</label>
                      <span className={`text-lg font-bold ${color}`}>{form[key]}/10</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={form[key]}
                      onChange={(e) => setForm({ ...form, [key]: parseInt(e.target.value) })}
                      className="w-full accent-primary-600"
                    />
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Low</span><span>High</span>
                    </div>
                  </div>
                ))}

                {/* Feedback */}
                <div>
                  <label className="label">Feedback *</label>
                  <textarea
                    value={form.feedback}
                    onChange={(e) => setForm({ ...form, feedback: e.target.value })}
                    className="input-field"
                    rows={4}
                    placeholder="Provide detailed feedback..."
                  />
                </div>

                {/* Decision Buttons */}
                <div className="space-y-2">
                  <button
                    onClick={() => handleSubmitReview('Approved')}
                    disabled={submitting}
                    className="w-full btn-success flex items-center justify-center gap-2"
                  >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                    Approve
                  </button>
                  <button
                    onClick={() => handleSubmitReview('Needs_Improvement')}
                    disabled={submitting}
                    className="w-full bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 flex items-center justify-center gap-2"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    Request Improvement
                  </button>
                  <button
                    onClick={() => handleSubmitReview('Rejected')}
                    disabled={submitting}
                    className="w-full btn-danger flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </button>
                </div>
              </div>
            </Card>
          ) : (
            <Card title="Review Status">
              <div className="text-center py-4">
                <StatusBadge status={statusMap[idea.status] || idea.status} />
                <p className="text-sm text-gray-500 mt-3">This idea has already been reviewed.</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default ReviewIdea
