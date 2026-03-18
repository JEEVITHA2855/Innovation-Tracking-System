import React, { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'

const AppContext = createContext()

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}

// Use sessionStorage for tab-specific sessions (allows multiple users in different tabs)
// Use localStorage for persistent sessions (stays logged in across tabs)
const USE_SESSION_STORAGE = true; // Set to false for production to use localStorage

const storage = USE_SESSION_STORAGE ? sessionStorage : localStorage;

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = storage.getItem('auth_user')
    return saved ? JSON.parse(saved) : null
  })

  const [token, setToken] = useState(() => storage.getItem('auth_token'))
  const [toast, setToast] = useState(null)
  const [loading, setLoading] = useState(false)

  const userRole = currentUser?.role || null

  // Persist auth state
  useEffect(() => {
    if (currentUser && token) {
      storage.setItem('auth_user', JSON.stringify(currentUser))
      storage.setItem('auth_token', token)
    } else {
      storage.removeItem('auth_user')
      storage.removeItem('auth_token')
      // Also clear from localStorage if using sessionStorage
      if (USE_SESSION_STORAGE) {
        localStorage.removeItem('auth_user')
        localStorage.removeItem('auth_token')
      }
    }
  }, [currentUser, token])

  const login = async (email, password) => {
    setLoading(true)
    try {
      const res = await authAPI.login({ email, password })
      const { user, token: jwt } = res.data.data
      setCurrentUser(user)
      setToken(jwt)
      showToast('Login successful!', 'success')
      return user
    } catch (error) {
      // Don't show toast for login errors - let the Login page handle error display
      throw error
    } finally {
      setLoading(false)
    }
  }

  const register = async (name, email, password, role) => {
    setLoading(true)
    try {
      const res = await authAPI.register({ name, email, password, role })
      const { user, token: jwt } = res.data.data
      setCurrentUser(user)
      setToken(jwt)
      showToast('Registration successful!', 'success')
      return user
    } catch (error) {
      // Don't show toast for registration errors - let the Register page handle error display
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setCurrentUser(null)
    setToken(null)
    storage.removeItem('auth_user')
    storage.removeItem('auth_token')
    // Also clear from localStorage if using sessionStorage
    if (USE_SESSION_STORAGE) {
      localStorage.removeItem('auth_user')
      localStorage.removeItem('auth_token')
    }
  }

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const value = {
    currentUser,
    userRole,
    token,
    loading,
    login,
    register,
    logout,
    toast,
    showToast
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
