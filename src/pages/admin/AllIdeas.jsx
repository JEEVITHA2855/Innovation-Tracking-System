import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ideasService } from '../../services/api'
import { useApp } from '../../context/AppContext'
import Card from '../../components/common/Card'
import Table from '../../components/common/Table'
import Loading from '../../components/common/Loading'
import StatusBadge from '../../components/common/StatusBadge'
import Modal from '../../components/common/Modal'
import { Edit, Eye } from 'lucide-react'

const AllIdeas = () => {
  const navigate = useNavigate()
  const { showToast } = useApp()
  const [loading, setLoading] = useState(true)
  const [ideas, setIdeas] = useState([])
  const [filter, setFilter] = useState('All')
  const [selectedIdea, setSelectedIdea] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [newStatus, setNewStatus] = useState('')

  useEffect(() => {
    loadIdeas()
  }, [])

  const loadIdeas = async () => {
    try {
      setLoading(true)
      const data = await ideasService.getAll()
      setIdeas(data)
    } catch (error) {
      console.error('Error loading ideas:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async () => {
    try {
      await ideasService.update(selectedIdea.id, { status: newStatus })
      showToast('Status updated successfully', 'success')
      setShowModal(false)
      loadIdeas()
    } catch (error) {
      showToast('Failed to update status', 'error')
    }
  }

  const openStatusModal = (idea) => {
    setSelectedIdea(idea)
    setNewStatus(idea.status)
    setShowModal(true)
  }

  const filteredIdeas = filter === 'All' 
    ? ideas 
    : ideas.filter(idea => idea.status === filter)

  const filters = ['All', 'Submitted', 'Under Review', 'Approved', 'Rejected', 'Needs Improvement']

  const headers = ['ID', 'Title', 'Innovator', 'Domain', 'Status', 'Submitted', 'Actions']

  const renderRow = (idea, index) => (
    <tr key={idea.id} className="hover:bg-gray-50">
      <td className="px-6 py-4 text-sm font-medium text-gray-900">#{idea.id}</td>
      <td className="px-6 py-4">
        <p className="font-medium text-gray-900">{idea.title}</p>
        <p className="text-sm text-gray-500 truncate max-w-xs">{idea.problemStatement}</p>
      </td>
      <td className="px-6 py-4 text-gray-700">{idea.innovatorName}</td>
      <td className="px-6 py-4">
        <span className="px-2 py-1 bg-primary-100 text-primary-800 rounded text-xs font-medium">
          {idea.domain}
        </span>
      </td>
      <td className="px-6 py-4">
        <StatusBadge status={idea.status} />
      </td>
      <td className="px-6 py-4 text-sm text-gray-500">{idea.submittedDate}</td>
      <td className="px-6 py-4">
        <div className="flex gap-2">
          <button
            onClick={() => openStatusModal(idea)}
            className="text-primary-600 hover:text-primary-700"
            title="Change Status"
          >
            <Edit className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  )

  if (loading) {
    return <Loading />
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">All Ideas</h1>
        <p className="text-gray-600 mt-2">View and manage all innovation submissions</p>
      </div>

      <Card>
        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === f
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredIdeas.length}</span> of{' '}
            <span className="font-semibold text-gray-900">{ideas.length}</span> ideas
          </p>
        </div>

        <Table
          headers={headers}
          data={filteredIdeas}
          renderRow={renderRow}
          emptyMessage="No ideas found"
        />
      </Card>

      {/* Status Change Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Change Idea Status"
        size="sm"
      >
        {selectedIdea && (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Idea</p>
              <p className="font-semibold text-gray-900">{selectedIdea.title}</p>
            </div>

            <div>
              <label className="label">New Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="input-field"
              >
                <option value="Submitted">Submitted</option>
                <option value="Under Review">Under Review</option>
                <option value="Needs Improvement">Needs Improvement</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button onClick={handleStatusChange} className="btn-primary flex-1">
                Update Status
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

export default AllIdeas
