import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Users, Store as StoreIcon, Star } from 'lucide-react'
import MainLayout from '../../layouts/MainLayout'
import Loader from '../../components/common/Loader'
import StatCard from '../../components/common/StatCard'
import { useAuth } from '../../hooks/useAuth'
import { getDashboardStats } from '../../services/admin.service'
import { getErrorMessage } from '../../utils/errorHandler'

export default function AdminDashboard() {
  const { user } = useAuth()

  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isSubscribed = true

    getDashboardStats()
      .then((data) => {
        if (isSubscribed) setStats(data)
      })
      .catch((err) => {
        if (isSubscribed) setError(getErrorMessage(err, 'Failed to load dashboard statistics.'))
      })
      .finally(() => {
        if (isSubscribed) setLoading(false)
      })

    return () => {
      isSubscribed = false
    }
  }, [])

  return (
    <MainLayout>
      <div className="page-container" style={{ padding: 'var(--sp-8) 0' }}>
        <div style={{ marginBottom: 'var(--sp-6)' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Admin Dashboard</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9375rem' }}>
            Welcome, {user?.name}
          </p>
        </div>

        {/* Navigation Shortcuts */}
        <div style={{ display: 'flex', gap: 'var(--sp-4)', marginBottom: 'var(--sp-8)' }}>
          <Link to="/admin/users" className="btn btn-primary">
            Manage Users
          </Link>
          <Link to="/admin/stores" className="btn btn-primary">
            Manage Stores
          </Link>
        </div>

        {/* Dashboard Statistics */}
        {loading ? (
          <Loader label="Loading statistics…" />
        ) : error ? (
          <div
            style={{
              color: 'var(--color-error)',
              padding: 'var(--sp-4)',
              backgroundColor: 'var(--color-error-bg)',
              borderRadius: 'var(--radius)',
            }}
          >
            {error}
          </div>
        ) : stats ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 'var(--sp-6)',
            }}
          >
            <StatCard title="Total Users" value={stats.total_users ?? 0} icon={Users} />
            <StatCard title="Total Stores" value={stats.total_stores ?? 0} icon={StoreIcon} />
            <StatCard title="Total Ratings" value={stats.total_ratings ?? 0} icon={Star} />
          </div>
        ) : null}
      </div>
    </MainLayout>
  )
}
