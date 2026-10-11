import { useState, useEffect, useMemo } from 'react'
import MainLayout from '../../layouts/MainLayout'
import Loader from '../../components/common/Loader'
import EmptyState from '../../components/common/EmptyState'
import { useAuth } from '../../context/AuthContext'
import { getOwnerDashboard, getOwnerRatings } from '../../services/owner.service'
import { Store as StoreIcon, Star, Users } from 'lucide-react'

/* ── Small reusable pieces ────────────────────────────── */

function StatCard({ title, value, icon: Icon }) {
  return (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-4)' }}>
      <div style={{
        width: '48px', height: '48px', borderRadius: 'var(--radius)',
        backgroundColor: 'var(--color-primary-light)', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
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

function StoreCard({ store }) {
  return (
    <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--sp-4)' }}>
      <div>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>{store.name}</h3>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>{store.address}</p>
        {store.email && (
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8125rem', marginTop: 'var(--sp-1)' }}>
            {store.email}
          </p>
        )}
      </div>

      <div style={{ display: 'flex', gap: 'var(--sp-6)', alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Avg Rating</p>
          <p style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)' }}>
            {store.average_rating ? Number(store.average_rating).toFixed(1) : '—'}
          </p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Ratings</p>
          <p style={{ fontSize: '1.25rem', fontWeight: 700 }}>{store.total_ratings}</p>
        </div>
      </div>
    </div>
  )
}

/* ── Main page ────────────────────────────────────────── */

export default function OwnerDashboard() {
  const { user } = useAuth()

  const [stores, setStores] = useState([])
  const [ratings, setRatings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Sort state for ratings table
  const [sortField, setSortField] = useState('rated_at')
  const [sortOrder, setSortOrder] = useState('desc')

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError('')
      try {
        // Fetch dashboard (stores) first; the API returns 404 when the owner has no stores.
        let storesData = []
        try {
          const dashRes = await getOwnerDashboard()
          storesData = dashRes.stores ?? []
        } catch (err) {
          // 404 = no stores, which is a valid empty state, not an error.
          if (err.response?.status !== 404) throw err
        }

        // Fetch ratings (always returns 200 with an array, possibly empty).
        const ratingsRes = await getOwnerRatings()

        setStores(storesData)
        setRatings(ratingsRes.ratings ?? [])
      } catch {
        setError('Failed to load dashboard data. Please try again later.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  /* ── Derived stats ────────────────────────────────── */
  const totalStores = stores.length
  const totalRatings = stores.reduce((sum, s) => sum + (s.total_ratings ?? 0), 0)
  const overallAvg = totalRatings > 0
    ? (stores.reduce((sum, s) => sum + (s.average_rating ?? 0) * (s.total_ratings ?? 0), 0) / totalRatings).toFixed(1)
    : '—'

  /* ── Sorted ratings ───────────────────────────────── */
  const sortedRatings = useMemo(() => {
    const copy = [...ratings]
    copy.sort((a, b) => {
      let aVal = a[sortField]
      let bVal = b[sortField]

      // For string fields, compare case-insensitively
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        aVal = aVal.toLowerCase()
        bVal = bVal.toLowerCase()
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1
      return 0
    })
    return copy
  }, [ratings, sortField, sortOrder])

  function handleSort(field) {
    if (sortField === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  function SortIndicator({ field }) {
    if (sortField !== field) return null
    return <span aria-hidden="true"> {sortOrder === 'asc' ? '▲' : '▼'}</span>
  }

  /* ── Render ───────────────────────────────────────── */

  return (
    <MainLayout>
      <div className="page-container" style={{ padding: 'var(--sp-8) 0' }}>
        {/* Header */}
        <div style={{ marginBottom: 'var(--sp-6)' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Store Owner Dashboard</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9375rem' }}>
            Welcome, {user?.name}
          </p>
        </div>

        {/* Loading / Error */}
        {loading ? (
          <Loader label="Loading dashboard…" />
        ) : error ? (
          <div style={{
            color: 'var(--color-error)',
            padding: 'var(--sp-4)',
            backgroundColor: 'var(--color-error-bg)',
            borderRadius: 'var(--radius)',
          }}>
            {error}
          </div>
        ) : (
          <>
            {/* Summary stat cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 'var(--sp-6)',
              marginBottom: 'var(--sp-8)',
            }}>
              <StatCard title="Total Stores" value={totalStores} icon={StoreIcon} />
              <StatCard title="Total Ratings" value={totalRatings} icon={Star} />
              <StatCard title="Overall Avg Rating" value={overallAvg} icon={Users} />
            </div>

            {/* ── My Stores ──────────────────────────── */}
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: 'var(--sp-4)' }}>
              My Stores
            </h2>

            {stores.length === 0 ? (
              <EmptyState
                title="No stores yet"
                message="You don't own any stores. Contact an admin to get a store assigned."
              />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)', marginBottom: 'var(--sp-10)' }}>
                {stores.map(store => (
                  <StoreCard key={store.id} store={store} />
                ))}
              </div>
            )}

            {/* ── Ratings Received ───────────────────── */}
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: 'var(--sp-4)' }}>
              Ratings Received
            </h2>

            {ratings.length === 0 ? (
              <EmptyState
                title="No ratings yet"
                message="Your stores haven't received any ratings from customers."
              />
            ) : (
              <div className="card" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9375rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                      {[
                        { key: 'store_name', label: 'Store' },
                        { key: 'user_name', label: 'Customer' },
                        { key: 'rating', label: 'Rating' },
                        { key: 'rated_at', label: 'Date' },
                      ].map(col => (
                        <th
                          key={col.key}
                          onClick={() => handleSort(col.key)}
                          style={{
                            textAlign: 'left',
                            padding: 'var(--sp-3) var(--sp-4)',
                            fontWeight: 600,
                            fontSize: '0.8125rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.04em',
                            color: 'var(--color-text-muted)',
                            cursor: 'pointer',
                            userSelect: 'none',
                          }}
                        >
                          {col.label}
                          <SortIndicator field={col.key} />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sortedRatings.map(r => (
                      <tr key={r.rating_id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <td style={{ padding: 'var(--sp-3) var(--sp-4)' }}>{r.store_name}</td>
                        <td style={{ padding: 'var(--sp-3) var(--sp-4)' }}>{r.user_name}</td>
                        <td style={{ padding: 'var(--sp-3) var(--sp-4)', fontWeight: 600, color: 'var(--color-primary)' }}>
                          {r.rating} / 5
                        </td>
                        <td style={{ padding: 'var(--sp-3) var(--sp-4)', color: 'var(--color-text-muted)' }}>
                          {new Date(r.rated_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  )
}
