import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ideasAPI } from '../../services/api'
import Card from '../../components/common/Card'
import StatusBadge from '../../components/common/StatusBadge'
import Loading from '../../components/common/Loading'
import { Search, Filter } from 'lucide-react'

const statusMap = {
  'Submitted': 'Submitted',
  'Under_Review': 'Under Review',
  'Approved': 'Approved',
  'Rejected': 'Rejected',
  'Needs_Improvement': 'Needs Improvement'
}

const AssignedIdeas = () => {
  const navigate = useNavigate()
  const [ideas, setIdeas] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')

  useEffect(() => {
    loadIdeas()
  }, [])

  const loadIdeas = async () => {
    try {
      const res = await ideasAPI.getAssigned()
      setIdeas(res.data.data)
    } catch (err) {
      console.error('Failed to load ideas:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredIdeas = ideas.filter(idea => {
    const statusDisplay = statusMap[idea.status] || idea.status
    const matchesFilter = filter === 'All' || statusDisplay === filter
    const matchesSearch = idea.title.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  if (loading) return <Loading />

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Assigned Ideas</h1>
        <p className="text-gray-600 mt-2">Ideas assigned to you for evaluation</p>
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
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="input-field w-auto">
            <option value="All">All</option>
            <option value="Under Review">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Needs Improvement">Needs Improvement</option>
          </select>
        </div>

        {filteredIdeas.length > 0 ? (
          <div className="space-y-4">
            {filteredIdeas.map(idea => (
              <div key={idea.id} className="p-5 border border-gray-100 rounded-lg hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{idea.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {idea.domain} • by {idea.innovator?.name} • {new Date(idea.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <StatusBadge status={statusMap[idea.status] || idea.status} />
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 mb-4">{idea.description}</p>
                <div className="flex justify-end">
                  {idea.status === 'Under_Review' ? (
                    <button onClick={() => navigate(`/reviewer/review/${idea.id}`)} className="btn-primary text-sm">
                      Review Now
                    </button>
                  ) : (
                    <button onClick={() => navigate(`/reviewer/review/${idea.id}`)} className="btn-secondary text-sm">
                      View Details
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">No ideas found</div>
        )}
      </Card>
    </div>
  )
}

export default AssignedIdeas
