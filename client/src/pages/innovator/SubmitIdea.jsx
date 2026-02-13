import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { ideasAPI } from '../../services/api'
import Card from '../../components/common/Card'
import { Send, Loader2 } from 'lucide-react'

const domains = [
  'AI', 'Web', 'FinTech', 'Healthcare', 'Sustainability',
  'IoT', 'Data Science', 'Cybersecurity', 'EdTech', 'Other'
]

const SubmitIdea = () => {
  const navigate = useNavigate()
  const { showToast } = useApp()
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    domain: ''
  })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const newErrors = {}
    if (!form.title.trim()) newErrors.title = 'Title is required'
    if (!form.description.trim()) newErrors.description = 'Description is required'
    if (form.description.trim().length < 20) newErrors.description = 'Description must be at least 20 characters'
    if (!form.domain) newErrors.domain = 'Domain is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    try {
      await ideasAPI.create(form)
      showToast('Idea submitted successfully!', 'success')
      navigate('/innovator/my-ideas')
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to submit idea', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Submit New Idea</h1>
        <p className="text-gray-600 mt-2">Share your innovative idea with the organization</p>
      </div>

      <div className="max-w-3xl">
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="label">Idea Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className={`input-field ${errors.title ? 'border-red-500' : ''}`}
                placeholder="Give your idea a clear, descriptive title"
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="label">Domain *</label>
              <select
                value={form.domain}
                onChange={(e) => setForm({ ...form, domain: e.target.value })}
                className={`input-field ${errors.domain ? 'border-red-500' : ''}`}
              >
                <option value="">Select a domain</option>
                {domains.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              {errors.domain && <p className="text-red-500 text-xs mt-1">{errors.domain}</p>}
            </div>

            <div>
              <label className="label">Description *</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className={`input-field min-h-[200px] ${errors.description ? 'border-red-500' : ''}`}
                placeholder="Describe the problem, your proposed solution, and the expected impact..."
                rows={8}
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
              <p className="text-xs text-gray-400 mt-1">{form.description.length} characters</p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <button type="button" onClick={() => navigate(-1)} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" disabled={submitting} className="btn-primary flex items-center gap-2">
                {submitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" />Submitting...</>
                ) : (
                  <><Send className="w-4 h-4" />Submit Idea</>
                )}
              </button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}

export default SubmitIdea
