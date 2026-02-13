import React from 'react'

const statusColors = {
  'Submitted': 'bg-blue-100 text-blue-800',
  'Under Review': 'bg-yellow-100 text-yellow-800',
  'Needs Improvement': 'bg-orange-100 text-orange-800',
  'Approved': 'bg-green-100 text-green-800',
  'Rejected': 'bg-red-100 text-red-800'
}

const StatusBadge = ({ status }) => {
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  )
}

export default StatusBadge
