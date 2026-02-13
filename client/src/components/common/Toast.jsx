import React, { useEffect } from 'react'
import { useApp } from '../../context/AppContext'
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react'

const Toast = () => {
  const { toast } = useApp()

  if (!toast) return null

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    warning: <AlertCircle className="w-5 h-5 text-yellow-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />
  }

  const bgColors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200'
  }

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg ${bgColors[toast.type]}`}>
        {icons[toast.type]}
        <p className="text-sm font-medium text-gray-900">{toast.message}</p>
      </div>
    </div>
  )
}

export default Toast
