import React, { useState, useEffect } from 'react'
import { ideasAPI, usersAPI } from '../../services/api'
import { useApp } from '../../context/AppContext'
import Card from '../../components/common/Card'
import Table from '../../components/common/Table'
import StatusBadge from '../../components/common/StatusBadge'
import Modal from '../../components/common/Modal'
import Loading from '../../components/common/Loading'
import { Search, Filter, UserPlus } from 'lucide-react'

const AllIdeas = () => {
  const { showToast } = useApp()
  const [ideas, setIdeas] = useState([])
  const [reviewers, setReviewers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [assignModal, setAssignModal] = useState({ open: false, ideaId: null })
  const [selectedReviewer, setSelectedReviewer] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [ideasRes, reviewersRes] = await Promise.all([
        ideasAPI.getAll(),
        usersAPI.getByRole('reviewer')
      ])
      setIdeas(ideasRes.data.data)
      setReviewers(reviewersRes.data.data)
    } catch (err) {
      showToast('Failed to load data', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleAssignReviewer = async () => {
    if (!selectedReviewer) return
    try {
      await ideasAPI.assignReviewer(assignModal.ideaId, parseInt(selectedReviewer))
      showToast('Reviewer assigned successfully!', 'success')
      setAssignModal({ open: false, ideaId: null })
      setSelectedReviewer('')
      loadData()
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to assign reviewer', 'error')
    }
  }

  const statusMap = {
    'Submitted': 'Submitted',
    'Under_Review': 'Under Review',
    'Approved': 'Approved',
    'Rejected': 'Rejected',
    'Needs_Improvement': 'Needs Improvement'
  }

  const filteredIdeas = ideas.filter(idea => {
    const statusDisplay = statusMap[idea.status] || idea.status
    const matchesFilter = filter === 'All' || statusDisplay === filter
    const matchesSearch = idea.title.toLowerCase().includes(search.toLowerCase()) ||
      idea.domain.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  if (loading) return <Loading />

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">All Ideas</h1>
        <p className="text-gray-600 mt-2">Manage and oversee all submitted ideas</p>
      </div>

      <Card>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search ideas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="input-field w-auto"
            >
              <option value="All">All Status</option>
              <option value="Submitted">Submitted</option>
              <option value="Under Review">Under Review</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Needs Improvement">Needs Improvement</option>
            </select>
          </div>
        </div>

        <Table
          headers={['Title', 'Domain', 'Innovator', 'Reviewer', 'Status', 'Date', 'Actions']}
          data={filteredIdeas}
          emptyMessage="No ideas found"
          renderRow={(idea) => (
            <tr key={idea.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <p className="text-sm font-medium text-gray-900">{idea.title}</p>
              </td>
              <td className="px-6 py-4">
                <span className="px-2 py-1 bg-primary-50 text-primary-700 rounded text-xs font-medium">
                  {idea.domain}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">{idea.innovator?.name || '-'}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{idea.reviewer?.name || 'Unassigned'}</td>
              <td className="px-6 py-4">
                <StatusBadge status={statusMap[idea.status] || idea.status} />
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {new Date(idea.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4">
                {!idea.reviewer && (
                  <button
                    onClick={() => setAssignModal({ open: true, ideaId: idea.id })}
                    className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    <UserPlus className="w-4 h-4" />
                    Assign
                  </button>
                )}
              </td>
            </tr>
          )}
        />
      </Card>

      {/* Assign Reviewer Modal */}
      <Modal
        isOpen={assignModal.open}
        onClose={() => { setAssignModal({ open: false, ideaId: null }); setSelectedReviewer(''); }}
        title="Assign Reviewer"
      >
        <div className="space-y-4">
          <div>
            <label className="label">Select Reviewer</label>
            <select
              value={selectedReviewer}
              onChange={(e) => setSelectedReviewer(e.target.value)}
              className="input-field"
            >
              <option value="">Choose a reviewer...</option>
              {reviewers.map(r => (
                <option key={r.id} value={r.id}>{r.name} ({r.email})</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={() => setAssignModal({ open: false, ideaId: null })} className="btn-secondary">
              Cancel
            </button>
            <button onClick={handleAssignReviewer} className="btn-primary" disabled={!selectedReviewer}>
              Assign Reviewer
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default AllIdeas
