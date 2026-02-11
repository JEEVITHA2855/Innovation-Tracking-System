import React, { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext()

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}

export const AppProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem('current_user_role') || null
  })
  
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('current_user')
    return saved ? JSON.parse(saved) : null
  })

  const [toast, setToast] = useState(null)

  // Update localStorage when user changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('current_user', JSON.stringify(currentUser))
      localStorage.setItem('current_user_role', currentUser.role)
    } else {
      localStorage.removeItem('current_user')
      localStorage.removeItem('current_user_role')
    }
  }, [currentUser])

  const selectRole = (role, user) => {
    setUserRole(role)
    setCurrentUser(user)
  }

  const logout = () => {
    setUserRole(null)
    setCurrentUser(null)
    localStorage.removeItem('current_user')
    localStorage.removeItem('current_user_role')
  }

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const value = {
    userRole,
    currentUser,
    selectRole,
    logout,
    toast,
    showToast
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
