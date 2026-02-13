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

const MyIdeas = () => {
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
      const res = await ideasAPI.getMyIdeas()
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
        <h1 className="text-3xl font-bold text-gray-900">My Ideas</h1>
        <p className="text-gray-600 mt-2">View and track all your submitted ideas</p>
      </div>

      <Card>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search your ideas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select value={filter} onChange={(e) => setFilter(e.target.value)} className="input-field w-auto">
              <option value="All">All</option>
              <option value="Submitted">Submitted</option>
              <option value="Under Review">Under Review</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Needs Improvement">Needs Improvement</option>
            </select>
          </div>
        </div>

        {filteredIdeas.length > 0 ? (
          <div className="space-y-4">
            {filteredIdeas.map(idea => (
              <div
                key={idea.id}
                onClick={() => navigate(`/innovator/idea/${idea.id}`)}
                className="p-5 border border-gray-100 rounded-lg hover:shadow-md cursor-pointer transition-all"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{idea.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {idea.domain} • Submitted {new Date(idea.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <StatusBadge status={statusMap[idea.status] || idea.status} />
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{idea.description}</p>
                {idea.reviews?.length > 0 && (
                  <div className="mt-3 flex gap-4 text-sm">
                    {(() => {
                      const review = idea.reviews[0]
                      return (
                        <>
                          <span className="text-gray-500">Innovation: <strong>{review.innovationScore}/10</strong></span>
                          <span className="text-gray-500">Feasibility: <strong>{review.feasibilityScore}/10</strong></span>
                          <span className="text-gray-500">Impact: <strong>{review.impactScore}/10</strong></span>
                        </>
                      )
                    })()}
                  </div>
                )}
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

export default MyIdeas
