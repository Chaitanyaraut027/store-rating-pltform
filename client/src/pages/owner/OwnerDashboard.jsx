import { useNavigate } from 'react-router-dom'
import MainLayout from '../../layouts/MainLayout'
import Button from '../../components/common/Button'
import { useAuth } from '../../context/AuthContext'

export default function OwnerDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/', { replace: true })
  }

  return (
    <MainLayout>
      <div className="page-container" style={{ padding: 'var(--sp-12) var(--sp-6)' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 'var(--sp-2)' }}>
          Store Owner Dashboard
        </h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--sp-8)' }}>
          Welcome, {user?.name}. Store management coming soon.
        </p>
        <Button variant="secondary" onClick={handleLogout}>Sign out</Button>
      </div>
    </MainLayout>
  )
}
