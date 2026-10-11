import { useState, useEffect, useCallback } from 'react'
import MainLayout from '../../layouts/MainLayout'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Loader from '../../components/common/Loader'
import EmptyState from '../../components/common/EmptyState'
import { getStores, submitRating } from '../../services/store.service'
import { useAuth } from '../../context/AuthContext'

export default function UserDashboard() {
  const { user } = useAuth()
  const [stores, setStores] = useState([])
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, total_pages: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Filters and Sorting
  const [searchName, setSearchName] = useState('')
  const [searchAddress, setSearchAddress] = useState('')
  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState('desc')
  const [page, setPage] = useState(1)

  // Rating state
  const [ratingInput, setRatingInput] = useState({})
  const [submittingRating, setSubmittingRating] = useState({})

  const fetchStores = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params = {
        page,
        limit: 10,
        sortBy,
        sortOrder,
        ...(searchName.trim() && { name: searchName.trim() }),
        ...(searchAddress.trim() && { address: searchAddress.trim() })
      }
      const data = await getStores(params)
      setStores(data.stores)
      setPagination(data.pagination)

      // Initialize rating inputs with current ratings
      const initialRatings = {}
      data.stores.forEach(store => {
        initialRatings[store.id] = store.user_rating || ''
      })
      setRatingInput(initialRatings)
    } catch (err) {
      setError('Failed to fetch stores. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [page, sortBy, sortOrder, searchName, searchAddress])

  useEffect(() => {
    fetchStores()
  }, [fetchStores])

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1) // Reset to page 1 on new search
    fetchStores()
  }

  const handleRatingSubmit = async (storeId) => {
    const ratingValue = parseInt(ratingInput[storeId], 10)
    if (isNaN(ratingValue) || ratingValue < 1 || ratingValue > 5) {
      alert('Rating must be between 1 and 5.')
      return
    }

    setSubmittingRating(prev => ({ ...prev, [storeId]: true }))
    try {
      await submitRating(storeId, ratingValue)
      // Optimistically update the UI or refetch
      fetchStores()
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit rating.'
      alert(msg)
    } finally {
      setSubmittingRating(prev => ({ ...prev, [storeId]: false }))
    }
  }

  return (
    <MainLayout>
      <div className="page-container" style={{ padding: 'var(--sp-8) 0' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 'var(--sp-6)' }}>
          Stores
        </h1>

        {/* Controls */}
        <div className="card" style={{ marginBottom: 'var(--sp-6)', padding: 'var(--sp-4)' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: 'var(--sp-4)', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <Input
              id="searchName"
              label="Search by Name"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              style={{ flex: '1 1 200px' }}
            />
            <Input
              id="searchAddress"
              label="Search by Address"
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
              style={{ flex: '1 1 200px' }}
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-1)' }}>
              <label className="input-label" htmlFor="sortBy">Sort By</label>
              <select
                id="sortBy"
                className="input-field"
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                style={{ width: '150px' }}
              >
                <option value="created_at">Date Added</option>
                <option value="name">Name</option>
                <option value="address">Address</option>
                <option value="average_rating">Avg Rating</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-1)' }}>
              <label className="input-label" htmlFor="sortOrder">Order</label>
              <select
                id="sortOrder"
                className="input-field"
                value={sortOrder}
                onChange={(e) => { setSortOrder(e.target.value); setPage(1); }}
                style={{ width: '120px' }}
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>

            <Button type="submit" variant="primary">Apply</Button>
          </form>
        </div>

        {/* Store List */}
        {loading ? (
          <Loader label="Loading stores..." />
        ) : error ? (
          <div style={{ color: 'var(--color-error)', textAlign: 'center', padding: 'var(--sp-8)' }}>
            {error}
          </div>
        ) : stores.length === 0 ? (
          <EmptyState title="No stores found" message="Try adjusting your search or filters." />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
            {stores.map(store => (
              <div key={store.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--sp-4)' }}>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>{store.name}</h3>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>{store.address}</p>
                  <p style={{ fontSize: '0.875rem', marginTop: 'var(--sp-1)' }}>
                    Avg Rating: <strong>{store.average_rating ? Number(store.average_rating).toFixed(1) : 'Not rated yet'}</strong>
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
                  <label htmlFor={`rating-${store.id}`} className="input-label" style={{ margin: 0 }}>Your Rating:</label>
                  <select
                    id={`rating-${store.id}`}
                    className="input-field"
                    value={ratingInput[store.id] || ''}
                    onChange={(e) => setRatingInput(prev => ({ ...prev, [store.id]: e.target.value }))}
                    style={{ width: '70px', padding: 'var(--sp-1)' }}
                  >
                    <option value="">-</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                  <Button
                    variant={store.user_rating ? "secondary" : "primary"}
                    onClick={() => handleRatingSubmit(store.id)}
                    disabled={submittingRating[store.id] || !ratingInput[store.id] || Number(ratingInput[store.id]) === store.user_rating}
                  >
                    {submittingRating[store.id] ? 'Saving...' : store.user_rating ? 'Update' : 'Submit'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.total_pages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 'var(--sp-4)', marginTop: 'var(--sp-8)' }}>
            <Button
              variant="secondary"
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
            >
              Previous
            </Button>
            <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
              Page {page} of {pagination.total_pages}
            </span>
            <Button
              variant="secondary"
              disabled={page === pagination.total_pages}
              onClick={() => setPage(p => p + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
