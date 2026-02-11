import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { ideasService } from '../../services/api'
import { innovationDomains } from '../../mock/data'
import Card from '../../components/common/Card'
import { Send, ArrowLeft } from 'lucide-react'

const SubmitIdea = () => {
  const navigate = useNavigate()
  const { currentUser, showToast } = useApp()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    problemStatement: '',
    proposedSolution: '',
    domain: 'AI',
    expectedImpact: '',
    innovatorId: currentUser.id,
    innovatorName: currentUser.name
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!formData.title || !formData.problemStatement || !formData.proposedSolution || !formData.expectedImpact) {
      showToast('Please fill in all required fields', 'error')
      return
    }

    try {
      setLoading(true)
      await ideasService.create(formData)
      showToast('Idea submitted successfully!', 'success')
      navigate('/innovator/my-ideas')
    } catch (error) {
      showToast('Failed to submit idea. Please try again.', 'error')
      console.error('Error submitting idea:', error)
    } finally {
      setLoading(false)
    }
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

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Submit New Idea</h1>
        <p className="text-gray-600 mt-2">Share your innovative solution with reviewers</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="label">
              Idea Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter a concise title for your idea"
              required
            />
          </div>

          {/* Domain */}
          <div>
            <label className="label">
              Innovation Domain <span className="text-red-500">*</span>
            </label>
            <select
              name="domain"
              value={formData.domain}
              onChange={handleChange}
              className="input-field"
              required
            >
              {innovationDomains.map((domain) => (
                <option key={domain} value={domain}>
                  {domain}
                </option>
              ))}
            </select>
          </div>

          {/* Problem Statement */}
          <div>
            <label className="label">
              Problem Statement <span className="text-red-500">*</span>
            </label>
            <textarea
              name="problemStatement"
              value={formData.problemStatement}
              onChange={handleChange}
              className="input-field"
              rows="4"
              placeholder="Describe the problem your idea addresses"
              required
            />
          </div>

          {/* Proposed Solution */}
          <div>
            <label className="label">
              Proposed Solution <span className="text-red-500">*</span>
            </label>
            <textarea
              name="proposedSolution"
              value={formData.proposedSolution}
              onChange={handleChange}
              className="input-field"
              rows="5"
              placeholder="Explain your proposed solution in detail"
              required
            />
          </div>

          {/* Expected Impact */}
          <div>
            <label className="label">
              Expected Impact <span className="text-red-500">*</span>
            </label>
            <textarea
              name="expectedImpact"
              value={formData.expectedImpact}
              onChange={handleChange}
              className="input-field"
              rows="3"
              placeholder="Describe the potential impact and benefits"
              required
            />
          </div>

          {/* Attachments - UI Only */}
          <div>
            <label className="label">
              Attachments (Optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <p className="text-gray-500">Drag and drop files here or click to browse</p>
              <p className="text-xs text-gray-400 mt-2">(UI only - file upload not implemented)</p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center gap-2 flex-1"
            >
              <Send className="w-4 h-4" />
              {loading ? 'Submitting...' : 'Submit Idea'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/innovator/my-ideas')}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default SubmitIdea
