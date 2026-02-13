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

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('auth_user')
    return saved ? JSON.parse(saved) : null
  })

  const [token, setToken] = useState(() => localStorage.getItem('auth_token'))
  const [toast, setToast] = useState(null)
  const [loading, setLoading] = useState(false)

  const userRole = currentUser?.role || null

  // Persist auth state
  useEffect(() => {
    if (currentUser && token) {
      localStorage.setItem('auth_user', JSON.stringify(currentUser))
      localStorage.setItem('auth_token', token)
    } else {
      localStorage.removeItem('auth_user')
      localStorage.removeItem('auth_token')
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
      const msg = error.response?.data?.message || 'Login failed'
      showToast(msg, 'error')
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
      const msg = error.response?.data?.message || 'Registration failed'
      showToast(msg, 'error')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setCurrentUser(null)
    setToken(null)
    localStorage.removeItem('auth_user')
    localStorage.removeItem('auth_token')
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
