import { createContext, useContext, useEffect, useState } from 'react'
import { getMe } from '../services/auth.service'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true) // true while restoring session

  // On mount, restore session if a token exists
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setLoading(false)
      return
    }

    getMe()
      .then(setUser)
      .catch(() => {
        // Token is expired or invalid — clear it
        localStorage.removeItem('token')
      })
      .finally(() => setLoading(false))
  }, [])

  function saveSession(user, token) {
    localStorage.setItem('token', token)
    setUser(user)
  }

  function logout() {
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, saveSession, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
