import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Loader from '../components/common/Loader'
import { ROLE_HOME } from '../utils/constants'

/**
 * Wraps a route that requires authentication.
 * - `roles` (optional array): restrict to specific roles.
 * - Unauthenticated users are sent to /login with return location.
 * - Authenticated users with the wrong role are redirected to their own role home.
 */
export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <Loader label="Loading session…" />
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to={ROLE_HOME[user.role] ?? '/'} replace />
  }

  return children
}
