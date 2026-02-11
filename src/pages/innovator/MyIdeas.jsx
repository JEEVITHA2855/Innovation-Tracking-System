import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { ideasService } from '../../services/api'
import Card from '../../components/common/Card'
import Loading from '../../components/common/Loading'
import StatusBadge from '../../components/common/StatusBadge'
import { Eye, Plus } from 'lucide-react'

const MyIdeas = () => {
  const navigate = useNavigate()
  const { currentUser } = useApp()
  const [loading, setLoading] = useState(true)
  const [ideas, setIdeas] = useState([])
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    loadIdeas()
  }, [currentUser])

  const loadIdeas = async () => {
    try {
      setLoading(true)
      const userIdeas = await ideasService.getByInnovator(currentUser.id)
      setIdeas(userIdeas)
    } catch (error) {
      console.error('Error loading ideas:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredIdeas = filter === 'All' 
    ? ideas 
    : ideas.filter(idea => idea.status === filter)

  const filters = ['All', 'Submitted', 'Under Review', 'Approved', 'Rejected', 'Needs Improvement']

  if (loading) {
    return <Loading />
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Ideas</h1>
          <p className="text-gray-600 mt-2">View and track all your submitted ideas</p>
        </div>
        <button 
          onClick={() => navigate('/innovator/submit')}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Submit New Idea
        </button>
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

        {/* Ideas List */}
        <div className="space-y-4">
          {filteredIdeas.length > 0 ? (
            filteredIdeas.map((idea) => (
              <div
                key={idea.id}
                className="p-5 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{idea.title}</h3>
                    <p className="text-gray-600 mb-2">{idea.problemStatement}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="font-medium text-primary-600">{idea.domain}</span>
                      <span>•</span>
                      <span>Submitted: {idea.submittedDate}</span>
                      {idea.reviewerName && (
                        <>
                          <span>•</span>
                          <span>Reviewer: {idea.reviewerName}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <StatusBadge status={idea.status} />
                </div>

                {idea.scores && (
                  <div className="flex gap-4 mb-3 p-3 bg-gray-50 rounded">
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Innovation</p>
                      <p className="text-lg font-bold text-gray-900">{idea.scores.innovation}/10</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Feasibility</p>
                      <p className="text-lg font-bold text-gray-900">{idea.scores.feasibility}/10</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Impact</p>
                      <p className="text-lg font-bold text-gray-900">{idea.scores.impact}/10</p>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => navigate(`/innovator/idea/${idea.id}`)}
                  className="btn-secondary flex items-center gap-2 w-full justify-center"
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No ideas found for this filter</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

export default MyIdeas
