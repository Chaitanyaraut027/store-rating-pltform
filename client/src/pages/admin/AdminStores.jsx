import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import MainLayout from '../../layouts/MainLayout'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Loader from '../../components/common/Loader'
import EmptyState from '../../components/common/EmptyState'
import Pagination from '../../components/common/Pagination'
import { getStores, createStore, getStoreOwners } from '../../services/admin.service'
import { getErrorMessage } from '../../utils/errorHandler'
import { formatRating } from '../../utils/formatters'

export default function AdminStores() {
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

  // Create Store Form & Owners list
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newStoreData, setNewStoreData] = useState({ name: '', email: '', address: '', owner_id: '' })
  const [storeOwners, setStoreOwners] = useState([])
  const [loadingOwners, setLoadingOwners] = useState(false)
  const [ownersError, setOwnersError] = useState('')
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState('')

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

  // Fetch store owners when the create form is opened
  useEffect(() => {
    if (!showCreateForm) return

    let isSubscribed = true

    getStoreOwners()
      .then((owners) => {
        if (isSubscribed) setStoreOwners(owners || [])
      })
      .catch((err) => {
        if (isSubscribed) setOwnersError(getErrorMessage(err, 'Failed to load store owners list.'))
      })
      .finally(() => {
        if (isSubscribed) setLoadingOwners(false)
      })

    return () => {
      isSubscribed = false
    }
  }, [showCreateForm])

  const handleToggleCreateForm = () => {
    if (!showCreateForm) {
      setLoadingOwners(true)
      setOwnersError('')
    }
    setShowCreateForm((prev) => !prev)
  }

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

  const handleCreateStore = async (e) => {
    e.preventDefault()
    setCreateError('')

    if (!newStoreData.name.trim() || !newStoreData.email.trim() || !newStoreData.address.trim()) {
      setCreateError('Name, email, and address are required.')
      return
    }

    try {
      setCreating(true)
      const payload = {
        name: newStoreData.name.trim(),
        email: newStoreData.email.trim(),
        address: newStoreData.address.trim(),
        owner_id: newStoreData.owner_id ? parseInt(newStoreData.owner_id, 10) : undefined,
      }

      await createStore(payload)
      setShowCreateForm(false)
      setNewStoreData({ name: '', email: '', address: '', owner_id: '' })
      setLoading(true)
      setPage(1)
      setRefreshKey((k) => k + 1)
    } catch (err) {
      setCreateError(getErrorMessage(err, 'Failed to create store.'))
    } finally {
      setCreating(false)
    }
  }

  return (
    <MainLayout>
      <div className="page-container" style={{ padding: 'var(--sp-8) 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-6)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-4)' }}>
            <Link to="/admin" className="btn btn-ghost" style={{ padding: 'var(--sp-2)' }}>
              &larr; Back
            </Link>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Manage Stores</h1>
          </div>
          <Button variant="primary" onClick={handleToggleCreateForm}>
            {showCreateForm ? 'Cancel' : 'Add Store'}
          </Button>
        </div>

        {/* Create Store Form */}
        {showCreateForm && (
          <div className="card" style={{ marginBottom: 'var(--sp-6)' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: 'var(--sp-4)' }}>
              Create New Store
            </h2>
            {createError && (
              <div
                style={{
                  color: 'var(--color-error)',
                  backgroundColor: 'var(--color-error-bg)',
                  padding: 'var(--sp-3)',
                  borderRadius: 'var(--radius)',
                  marginBottom: 'var(--sp-4)',
                }}
              >
                {createError}
              </div>
            )}
            <form onSubmit={handleCreateStore} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-4)' }}>
              <Input
                id="name"
                label="Store Name"
                value={newStoreData.name}
                onChange={(e) => setNewStoreData({ ...newStoreData, name: e.target.value })}
                required
              />
              <Input
                id="email"
                type="email"
                label="Store Email"
                value={newStoreData.email}
                onChange={(e) => setNewStoreData({ ...newStoreData, email: e.target.value })}
                required
              />
              <Input
                id="address"
                label="Store Address"
                value={newStoreData.address}
                onChange={(e) => setNewStoreData({ ...newStoreData, address: e.target.value })}
                required
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-1)' }}>
                <label className="input-label" htmlFor="owner_id">
                  Assigned Store Owner (Optional)
                </label>
                <select
                  id="owner_id"
                  className="input-field"
                  value={newStoreData.owner_id}
                  onChange={(e) => setNewStoreData({ ...newStoreData, owner_id: e.target.value })}
                  disabled={loadingOwners}
                >
                  <option value="">-- No Owner Assigned --</option>
                  {storeOwners.map((owner) => (
                    <option key={owner.id} value={owner.id}>
                      {owner.name} ({owner.email})
                    </option>
                  ))}
                </select>
                {loadingOwners && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    Loading store owners…
                  </span>
                )}
                {ownersError && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-error)' }}>
                    {ownersError}
                  </span>
                )}
              </div>
              <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="submit" variant="primary" disabled={creating} style={{ width: '200px' }}>
                  {creating ? 'Creating…' : 'Create Store'}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Search & Sort Controls */}
        <div className="card" style={{ marginBottom: 'var(--sp-6)', padding: 'var(--sp-4)' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: 'var(--sp-4)', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <Input
              id="searchName"
              label="Search by Name"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              style={{ flex: '1 1 150px' }}
            />
            <Input
              id="searchAddress"
              label="Search by Address"
              value={inputAddress}
              onChange={(e) => setInputAddress(e.target.value)}
              style={{ flex: '1 1 150px' }}
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
                style={{ width: '130px' }}
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
                style={{ width: '110px' }}
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

        {/* Stores Table */}
        {loading ? (
          <Loader label="Loading stores…" />
        ) : error ? (
          <div style={{ color: 'var(--color-error)', textAlign: 'center', padding: 'var(--sp-8)' }}>
            {error}
          </div>
        ) : stores.length === 0 ? (
          <EmptyState title="No stores found" message="Try adjusting your search criteria." />
        ) : (
          <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-alt)' }}>
                  <th style={{ padding: 'var(--sp-3) var(--sp-4)', fontWeight: 600, fontSize: '0.875rem' }}>Name</th>
                  <th style={{ padding: 'var(--sp-3) var(--sp-4)', fontWeight: 600, fontSize: '0.875rem' }}>Contact / Address</th>
                  <th style={{ padding: 'var(--sp-3) var(--sp-4)', fontWeight: 600, fontSize: '0.875rem' }}>Owner</th>
                  <th style={{ padding: 'var(--sp-3) var(--sp-4)', fontWeight: 600, fontSize: '0.875rem' }}>Avg Rating</th>
                </tr>
              </thead>
              <tbody>
                {stores.map((store) => (
                  <tr key={store.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: 'var(--sp-3) var(--sp-4)', fontSize: '0.9375rem', fontWeight: 500 }}>
                      {store.name}
                    </td>
                    <td style={{ padding: 'var(--sp-3) var(--sp-4)', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                      <div>{store.email}</div>
                      <div style={{ marginTop: '2px', fontSize: '0.8125rem' }}>{store.address}</div>
                    </td>
                    <td style={{ padding: 'var(--sp-3) var(--sp-4)', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                      {store.owner_name ? (
                        <>
                          <div style={{ fontWeight: 500, color: 'var(--color-text)' }}>{store.owner_name}</div>
                          <div style={{ fontSize: '0.8125rem' }}>ID: {store.owner_id}</div>
                        </>
                      ) : (
                        <span style={{ fontStyle: 'italic' }}>Unassigned</span>
                      )}
                    </td>
                    <td style={{ padding: 'var(--sp-3) var(--sp-4)', fontSize: '0.9375rem', fontWeight: 500 }}>
                      {formatRating(store.average_rating, '-')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
