import React, { useState, useEffect } from 'react'
import { usersAPI, ideasAPI } from '../../services/api'
import { useApp } from '../../context/AppContext'
import Card from '../../components/common/Card'
import Table from '../../components/common/Table'
import Modal from '../../components/common/Modal'
import Loading from '../../components/common/Loading'
import { Users, UserPlus } from 'lucide-react'

const ManageReviewers = () => {
  const { showToast } = useApp()
  const [reviewers, setReviewers] = useState([])
  const [ideas, setIdeas] = useState([])
  const [loading, setLoading] = useState(true)
  const [assignModal, setAssignModal] = useState({ open: false, ideaId: null })
  const [selectedReviewer, setSelectedReviewer] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [reviewersRes, ideasRes] = await Promise.all([
        usersAPI.getByRole('reviewer'),
        ideasAPI.getAll()
      ])
      setReviewers(reviewersRes.data.data)
      setIdeas(ideasRes.data.data)
    } catch (err) {
      showToast('Failed to load data', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleAssign = async () => {
    if (!selectedReviewer || !assignModal.ideaId) return
    try {
      await ideasAPI.assignReviewer(assignModal.ideaId, parseInt(selectedReviewer))
      showToast('Reviewer assigned successfully!', 'success')
      setAssignModal({ open: false, ideaId: null })
      setSelectedReviewer('')
      loadData()
    } catch (err) {
      showToast(err.response?.data?.message || 'Assignment failed', 'error')
    }
  }

  if (loading) return <Loading />

  const unassignedIdeas = ideas.filter(i => !i.reviewer)
  const reviewerStats = reviewers.map(r => ({
    ...r,
    assignedCount: ideas.filter(i => i.reviewer?.id === r.id).length,
    reviewedCount: ideas.filter(i => i.reviewer?.id === r.id && ['Approved', 'Rejected', 'Needs_Improvement'].includes(i.status)).length
  }))

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Reviewers</h1>
        <p className="text-gray-600 mt-2">Assign reviewers and track their workload</p>
      </div>

      {/* Reviewer Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {reviewerStats.map((reviewer) => (
          <Card key={reviewer.id}>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-100 p-2 rounded-full">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{reviewer.name}</p>
                <p className="text-xs text-gray-500">{reviewer.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-2xl font-bold text-blue-600">{reviewer.assignedCount}</p>
                <p className="text-xs text-gray-600">Assigned</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <p className="text-2xl font-bold text-green-600">{reviewer.reviewedCount}</p>
                <p className="text-xs text-gray-600">Reviewed</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Unassigned Ideas */}
      <Card title={`Unassigned Ideas (${unassignedIdeas.length})`}>
        <Table
          headers={['Title', 'Domain', 'Innovator', 'Submitted', 'Action']}
          data={unassignedIdeas}
          emptyMessage="All ideas have been assigned!"
          renderRow={(idea) => (
            <tr key={idea.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm font-medium text-gray-900">{idea.title}</td>
              <td className="px-6 py-4">
                <span className="px-2 py-1 bg-primary-50 text-primary-700 rounded text-xs font-medium">{idea.domain}</span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">{idea.innovator?.name}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{new Date(idea.createdAt).toLocaleDateString()}</td>
              <td className="px-6 py-4">
                <button
                  onClick={() => setAssignModal({ open: true, ideaId: idea.id })}
                  className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  <UserPlus className="w-4 h-4" />
                  Assign
                </button>
              </td>
            </tr>
          )}
        />
      </Card>

      <Modal
        isOpen={assignModal.open}
        onClose={() => { setAssignModal({ open: false, ideaId: null }); setSelectedReviewer(''); }}
        title="Assign Reviewer"
      >
        <div className="space-y-4">
          <select value={selectedReviewer} onChange={(e) => setSelectedReviewer(e.target.value)} className="input-field">
            <option value="">Select a reviewer...</option>
            {reviewers.map(r => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
          <div className="flex justify-end gap-3">
            <button onClick={() => setAssignModal({ open: false, ideaId: null })} className="btn-secondary">Cancel</button>
            <button onClick={handleAssign} className="btn-primary" disabled={!selectedReviewer}>Assign</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default ManageReviewers
