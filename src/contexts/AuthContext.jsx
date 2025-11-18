import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token') || null)
  const [role, setRole] = useState(localStorage.getItem('role') || null)
  const [loading, setLoading] = useState(!!token)

  useEffect(() => {
    if (token) {
      fetchUserProfile()
    } else {
      setLoading(false)
    }
  }, [token])

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
        setRole(userData.role)
      } else {
        console.error('Profile fetch failed:', response.status)
        setUser(null)
        setRole(null)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      setUser(null)
      setRole(null)
    } finally {
      setLoading(false)
    }
  }

  const login = (authToken, userData) => {
    setToken(authToken)
    localStorage.setItem('token', authToken)
    if (userData) {
      setUser(userData)
      setRole(userData.role)
      localStorage.setItem('role', userData.role)
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    setRole(null)
    localStorage.removeItem('token')
    localStorage.removeItem('role')
  }

  const value = {
    user,
    token,
    role,
    loading,
    login,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
