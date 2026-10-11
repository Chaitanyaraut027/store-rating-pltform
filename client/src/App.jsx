import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/auth/LoginPage.jsx'
import RegisterPage from './pages/auth/RegisterPage.jsx'
import UserDashboard from './pages/user/UserDashboard.jsx'
import OwnerDashboard from './pages/owner/OwnerDashboard.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import AdminUsers from './pages/admin/AdminUsers.jsx'
import AdminStores from './pages/admin/AdminStores.jsx'
import ProtectedRoute from './routes/ProtectedRoute.jsx'
import { ROLES } from './utils/constants'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute roles={[ROLES.USER]}>
            <UserDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/owner"
        element={
          <ProtectedRoute roles={[ROLES.STORE_OWNER]}>
            <OwnerDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={[ROLES.ADMIN]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute roles={[ROLES.ADMIN]}>
            <AdminUsers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/stores"
        element={
          <ProtectedRoute roles={[ROLES.ADMIN]}>
            <AdminStores />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}
