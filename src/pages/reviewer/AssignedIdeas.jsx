import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { ideasService } from '../../services/api'
import Card from '../../components/common/Card'
import Loading from '../../components/common/Loading'
import StatusBadge from '../../components/common/StatusBadge'
import { FileCheck } from 'lucide-react'

const AssignedIdeas = () => {
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
      const assignedIdeas = await ideasService.getByReviewer(currentUser.id)
      setIdeas(assignedIdeas)
    } catch (error) {
      console.error('Error loading ideas:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredIdeas = filter === 'All' 
    ? ideas 
    : filter === 'Pending'
    ? ideas.filter(idea => !idea.scores)
    : ideas.filter(idea => idea.scores !== null)

  const filters = ['All', 'Pending', 'Reviewed']

  if (loading) {
    return <Loading />
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Assigned Ideas</h1>
        <p className="text-gray-600 mt-2">Review and evaluate ideas assigned to you</p>
      </div>

      <Card>
        {/* Filters */}
        <div className="flex gap-2 mb-6">
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
                      <span>Submitted by: {idea.innovatorName}</span>
                      <span>•</span>
                      <span>{idea.submittedDate}</span>
                    </div>
                  </div>
                  <StatusBadge status={idea.status} />
                </div>

                {idea.scores ? (
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
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Overall</p>
                      <p className="text-lg font-bold text-gray-900">
                        {((idea.scores.innovation + idea.scores.feasibility + idea.scores.impact) / 3).toFixed(1)}/10
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-3">
                    <p className="text-sm text-yellow-800 font-medium">⏰ Awaiting your review</p>
                  </div>
                )}

                <button
                  onClick={() => navigate(`/reviewer/review/${idea.id}`)}
                  className={`flex items-center gap-2 w-full justify-center ${
                    idea.scores ? 'btn-secondary' : 'btn-primary'
                  }`}
                >
                  <FileCheck className="w-4 h-4" />
                  {idea.scores ? 'View Review' : 'Review Now'}
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

export default AssignedIdeas
