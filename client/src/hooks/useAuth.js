import { useContext } from 'react'
import { AuthContext } from '../context/authContextInstance'

/**
 * Custom hook to access authentication state and session controls.
 */
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used inside an AuthProvider')
  }
  return ctx
}
