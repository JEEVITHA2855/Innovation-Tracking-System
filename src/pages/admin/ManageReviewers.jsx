import React, { useState, useEffect } from 'react'
import { ideasService, reviewersService } from '../../services/api'
import { useApp } from '../../context/AppContext'
import Card from '../../components/common/Card'
import Loading from '../../components/common/Loading'
import Modal from '../../components/common/Modal'
import StatusBadge from '../../components/common/StatusBadge'
import { UserPlus } from 'lucide-react'

const ManageReviewers = () => {
  const { showToast } = useApp()
  const [loading, setLoading] = useState(true)
  const [ideas, setIdeas] = useState([])
  const [reviewers, setReviewers] = useState([])
  const [selectedIdea, setSelectedIdea] = useState(null)
  const [selectedReviewer, setSelectedReviewer] = useState('')
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [ideasData, reviewersData] = await Promise.all([
        ideasService.getAll(),
        reviewersService.getAll()
      ])
      setIdeas(ideasData)
      setReviewers(reviewersData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAssign = async () => {
    if (!selectedReviewer) {
      showToast('Please select a reviewer', 'error')
      return
    }

    try {
      await ideasService.assignReviewer(selectedIdea.id, parseInt(selectedReviewer))
      showToast('Reviewer assigned successfully', 'success')
      setShowModal(false)
      loadData()
    } catch (error) {
      showToast('Failed to assign reviewer', 'error')
    }
  }

  const openAssignModal = (idea) => {
    setSelectedIdea(idea)
    setSelectedReviewer(idea.reviewerId?.toString() || '')
    setShowModal(true)
  }

  const unassignedIdeas = ideas.filter(i => !i.reviewerId)
  const assignedIdeas = ideas.filter(i => i.reviewerId)

  if (loading) {
    return <Loading />
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Reviewers</h1>
        <p className="text-gray-600 mt-2">Assign reviewers to evaluate ideas</p>
      </div>

      {/* Reviewer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {reviewers.map((reviewer) => {
          const assignedCount = ideas.filter(i => i.reviewerId === reviewer.id).length
          const reviewedCount = ideas.filter(i => i.reviewerId === reviewer.id && i.scores).length

          return (
            <Card key={reviewer.id}>
              <div className="mb-3">
                <h3 className="font-semibold text-gray-900">{reviewer.name}</h3>
                <p className="text-xs text-gray-500">{reviewer.expertise.join(', ')}</p>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Assigned:</span>
                  <span className="font-bold text-gray-900">{assignedCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Reviewed:</span>
                  <span className="font-bold text-green-600">{reviewedCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pending:</span>
                  <span className="font-bold text-yellow-600">{assignedCount - reviewedCount}</span>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Unassigned Ideas */}
        <Card title={`Unassigned Ideas (${unassignedIdeas.length})`}>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {unassignedIdeas.length > 0 ? (
              unassignedIdeas.map((idea) => (
                <div key={idea.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{idea.title}</h4>
                      <p className="text-sm text-gray-600">{idea.domain}</p>
                      <p className="text-xs text-gray-500 mt-1">By {idea.innovatorName}</p>
                    </div>
                    <StatusBadge status={idea.status} />
                  </div>
                  <button
                    onClick={() => openAssignModal(idea)}
                    className="btn-primary w-full flex items-center justify-center gap-2 mt-3"
                  >
                    <UserPlus className="w-4 h-4" />
                    Assign Reviewer
                  </button>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">All ideas are assigned</p>
            )}
          </div>
        </Card>

        {/* Assigned Ideas */}
        <Card title={`Assigned Ideas (${assignedIdeas.length})`}>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {assignedIdeas.length > 0 ? (
              assignedIdeas.map((idea) => (
                <div key={idea.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{idea.title}</h4>
                      <p className="text-sm text-gray-600">{idea.domain}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-gray-500">By {idea.innovatorName}</p>
                        <span className="text-gray-400">•</span>
                        <p className="text-xs font-medium text-primary-600">
                          Reviewer: {idea.reviewerName}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={idea.status} />
                  </div>
                  <button
                    onClick={() => openAssignModal(idea)}
                    className="btn-secondary w-full text-sm mt-3"
                  >
                    Reassign
                  </button>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">No assigned ideas</p>
            )}
          </div>
        </Card>
      </div>

      {/* Assignment Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Assign Reviewer"
        size="sm"
      >
        {selectedIdea && (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Idea</p>
              <p className="font-semibold text-gray-900">{selectedIdea.title}</p>
              <p className="text-sm text-gray-500">{selectedIdea.domain}</p>
            </div>

            <div>
              <label className="label">Select Reviewer</label>
              <select
                value={selectedReviewer}
                onChange={(e) => setSelectedReviewer(e.target.value)}
                className="input-field"
              >
                <option value="">-- Select Reviewer --</option>
                {reviewers.map((reviewer) => {
                  const isExpert = reviewer.expertise.includes(selectedIdea.domain)
                  return (
                    <option key={reviewer.id} value={reviewer.id}>
                      {reviewer.name} {isExpert ? '(⭐ Expert)' : ''}
                    </option>
                  )
                })}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                ⭐ indicates expertise in this domain
              </p>
            </div>

            <div className="flex gap-3">
              <button onClick={handleAssign} className="btn-primary flex-1">
                Assign
              </button>
              <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">
                Cancel
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default ManageReviewers
