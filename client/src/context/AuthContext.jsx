import { useEffect, useState } from 'react'
import { AuthContext } from './authContextInstance'
import { getMe } from '../services/auth.service'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem('token')))

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return

    let isSubscribed = true

    getMe()
      .then((userData) => {
        if (isSubscribed) setUser(userData)
      })
      .catch(() => {
        localStorage.removeItem('token')
        if (isSubscribed) setUser(null)
      })
      .finally(() => {
        if (isSubscribed) setLoading(false)
      })

    return () => {
      isSubscribed = false
    }
  }, [])

  function saveSession(userData, token) {
    localStorage.setItem('token', token)
    setUser(userData)
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
