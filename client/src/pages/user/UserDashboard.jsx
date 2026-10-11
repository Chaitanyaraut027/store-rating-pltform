import { useState, useEffect } from 'react'
import MainLayout from '../../layouts/MainLayout'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Loader from '../../components/common/Loader'
import EmptyState from '../../components/common/EmptyState'
import Pagination from '../../components/common/Pagination'
import { getStores, submitRating } from '../../services/store.service'
import { getErrorMessage } from '../../utils/errorHandler'
import { formatRating } from '../../utils/formatters'

export default function UserDashboard() {
  const [stores, setStores] = useState([])
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, total_pages: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Search input state (buffered until Apply is clicked)
  const [inputName, setInputName] = useState('')
  const [inputAddress, setInputAddress] = useState('')

  // Applied Filters and Sorting
  const [searchName, setSearchName] = useState('')
  const [searchAddress, setSearchAddress] = useState('')
  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState('desc')
  const [page, setPage] = useState(1)
  const [refreshKey, setRefreshKey] = useState(0)

  // Rating state
  const [ratingInput, setRatingInput] = useState({})
  const [submittingRating, setSubmittingRating] = useState({})
  const [ratingError, setRatingError] = useState({})

  useEffect(() => {
    let isSubscribed = true

    async function loadStores() {
      try {
        const params = {
          page,
          limit: 10,
          sortBy,
          sortOrder,
          ...(searchName.trim() && { name: searchName.trim() }),
          ...(searchAddress.trim() && { address: searchAddress.trim() }),
        }
        const data = await getStores(params)
        if (!isSubscribed) return
        setStores(data.stores || [])
        setPagination(data.pagination || { page: 1, limit: 10, total: 0, total_pages: 0 })
        setError('')

        // Initialize rating inputs with current user ratings
        const initialRatings = {}
        ;(data.stores || []).forEach((store) => {
          initialRatings[store.id] = store.user_rating || ''
        })
        setRatingInput(initialRatings)
      } catch (err) {
        if (!isSubscribed) return
        setError(getErrorMessage(err, 'Failed to fetch stores. Please try again.'))
      } finally {
        if (isSubscribed) setLoading(false)
      }
    }

    loadStores()

    return () => {
      isSubscribed = false
    }
  }, [page, sortBy, sortOrder, searchName, searchAddress, refreshKey])

  const handleSearch = (e) => {
    e.preventDefault()
    setLoading(true)
    setPage(1)
    setSearchName(inputName)
    setSearchAddress(inputAddress)
    setRefreshKey((k) => k + 1)
  }

  const handlePageChange = (newPage) => {
    setLoading(true)
    setPage(newPage)
  }

  const handleSortByChange = (e) => {
    setLoading(true)
    setSortBy(e.target.value)
    setPage(1)
  }

  const handleSortOrderChange = (e) => {
    setLoading(true)
    setSortOrder(e.target.value)
    setPage(1)
  }

  const handleRatingSubmit = async (storeId) => {
    const ratingValue = parseInt(ratingInput[storeId], 10)
    const storeIdNum = parseInt(storeId, 10)

    if (isNaN(ratingValue) || ratingValue < 1 || ratingValue > 5) {
      setRatingError((prev) => ({ ...prev, [storeId]: 'Rating must be between 1 and 5.' }))
      return
    }

    setSubmittingRating((prev) => ({ ...prev, [storeId]: true }))
    setRatingError((prev) => ({ ...prev, [storeId]: null }))

    try {
      await submitRating(storeIdNum, ratingValue)
      setRefreshKey((k) => k + 1)
    } catch (err) {
      setRatingError((prev) => ({
        ...prev,
        [storeId]: getErrorMessage(err, 'Failed to submit rating.'),
      }))
    } finally {
      setSubmittingRating((prev) => ({ ...prev, [storeId]: false }))
    }
  }

  return (
    <MainLayout>
      <div className="page-container" style={{ padding: 'var(--sp-8) 0' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 'var(--sp-6)' }}>
          Stores
        </h1>

        {/* Search & Sort Controls */}
        <div className="card" style={{ marginBottom: 'var(--sp-6)', padding: 'var(--sp-4)' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: 'var(--sp-4)', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <Input
              id="searchName"
              label="Search by Name"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              style={{ flex: '1 1 200px' }}
            />
            <Input
              id="searchAddress"
              label="Search by Address"
              value={inputAddress}
              onChange={(e) => setInputAddress(e.target.value)}
              style={{ flex: '1 1 200px' }}
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-1)' }}>
              <label className="input-label" htmlFor="sortBy">
                Sort By
              </label>
              <select
                id="sortBy"
                className="input-field"
                value={sortBy}
                onChange={handleSortByChange}
                style={{ width: '150px' }}
              >
                <option value="created_at">Date Added</option>
                <option value="name">Name</option>
                <option value="address">Address</option>
                <option value="average_rating">Avg Rating</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-1)' }}>
              <label className="input-label" htmlFor="sortOrder">
                Order
              </label>
              <select
                id="sortOrder"
                className="input-field"
                value={sortOrder}
                onChange={handleSortOrderChange}
                style={{ width: '120px' }}
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>

            <Button type="submit" variant="primary">
              Apply
            </Button>
          </form>
        </div>

        {/* Store List */}
        {loading ? (
          <Loader label="Loading stores…" />
        ) : error ? (
          <div style={{ color: 'var(--color-error)', textAlign: 'center', padding: 'var(--sp-8)' }}>
            {error}
          </div>
        ) : stores.length === 0 ? (
          <EmptyState title="No stores found" message="Try adjusting your search or filters." />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
            {stores.map((store) => (
              <div
                key={store.id}
                className="card"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 'var(--sp-4)',
                }}
              >
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>{store.name}</h3>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>{store.address}</p>
                  <p style={{ fontSize: '0.875rem', marginTop: 'var(--sp-1)' }}>
                    Avg Rating:{' '}
                    <strong>
                      {store.average_rating ? `${formatRating(store.average_rating)} / 5` : 'Not rated yet'}
                    </strong>
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 'var(--sp-2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
                    <label htmlFor={`rating-${store.id}`} className="input-label" style={{ margin: 0 }}>
                      Your Rating:
                    </label>
                    <select
                      id={`rating-${store.id}`}
                      className="input-field"
                      value={ratingInput[store.id] || ''}
                      onChange={(e) =>
                        setRatingInput((prev) => ({ ...prev, [store.id]: e.target.value }))
                      }
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
                      variant={store.user_rating ? 'secondary' : 'primary'}
                      onClick={() => handleRatingSubmit(store.id)}
                      disabled={
                        submittingRating[store.id] ||
                        !ratingInput[store.id] ||
                        Number(ratingInput[store.id]) === store.user_rating
                      }
                    >
                      {submittingRating[store.id]
                        ? 'Saving…'
                        : store.user_rating
                        ? 'Update'
                        : 'Submit'}
                    </Button>
                  </div>
                  {ratingError[store.id] && (
                    <div style={{ color: 'var(--color-error)', fontSize: '0.8125rem' }}>
                      {ratingError[store.id]}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <Pagination
          page={page}
          totalPages={pagination.total_pages}
          onPageChange={handlePageChange}
        />
      </div>
    </MainLayout>
  )
}
