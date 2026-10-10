import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Loader from '../components/common/Loader'

const ROLE_HOME = {
  ADMIN: '/admin',
  STORE_OWNER: '/owner',
  USER: '/dashboard',
}

/**
 * Wraps a route that requires authentication.
 * - `roles` (optional array): restrict to specific roles.
 * - Unauthenticated users are sent to /login.
 * - Authenticated users with the wrong role are sent to their own home.
 */
export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <Loader label="Loading session…" />

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to={ROLE_HOME[user.role] ?? '/'} replace />
  }

  return children
}
