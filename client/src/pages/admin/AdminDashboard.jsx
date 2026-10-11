import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import MainLayout from '../../layouts/MainLayout'
import Button from '../../components/common/Button'
import Loader from '../../components/common/Loader'
import { useAuth } from '../../context/AuthContext'
import { getDashboardStats } from '../../services/admin.service'
import { Users, Store as StoreIcon, Star } from 'lucide-react'

function StatCard({ title, value, icon: Icon }) {
  return (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-4)' }}>
      <div style={{
        width: '48px', height: '48px', borderRadius: 'var(--radius)',
        backgroundColor: 'var(--color-primary-light)', display: 'flex',
        alignItems: 'center', justifyContent: 'center'
      }}>
        <Icon size={24} color="var(--color-primary)" />
      </div>
      <div>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{title}</p>
        <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>{value}</p>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch(() => setError('Failed to load dashboard statistics.'))
      .finally(() => setLoading(false))
  }, [])

  function handleLogout() {
    logout()
    navigate('/', { replace: true })
  }

  return (
    <MainLayout>
      <div className="page-container" style={{ padding: 'var(--sp-8) 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-6)' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Admin Dashboard</h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9375rem' }}>Welcome, {user?.name}</p>
          </div>
          <Button variant="secondary" onClick={handleLogout}>Sign out</Button>
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', gap: 'var(--sp-4)', marginBottom: 'var(--sp-8)' }}>
          <Link to="/admin/users" className="btn btn-primary">Manage Users</Link>
          <Link to="/admin/stores" className="btn btn-primary">Manage Stores</Link>
        </div>

        {/* Stats */}
        {loading ? (
          <Loader label="Loading statistics..." />
        ) : error ? (
          <div style={{ color: 'var(--color-error)', padding: 'var(--sp-4)', backgroundColor: 'var(--color-error-bg)', borderRadius: 'var(--radius)' }}>
            {error}
          </div>
        ) : stats ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--sp-6)' }}>
            <StatCard title="Total Users" value={stats.total_users} icon={Users} />
            <StatCard title="Total Stores" value={stats.total_stores} icon={StoreIcon} />
            <StatCard title="Total Ratings" value={stats.total_ratings} icon={Star} />
          </div>
        ) : null}
      </div>
    </MainLayout>
  )
}
