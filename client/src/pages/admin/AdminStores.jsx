import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import MainLayout from '../../layouts/MainLayout'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Loader from '../../components/common/Loader'
import EmptyState from '../../components/common/EmptyState'
import { getStores, createStore } from '../../services/admin.service'

export default function AdminStores() {
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

  // Create Store Form
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newStoreData, setNewStoreData] = useState({ name: '', email: '', address: '', owner_id: '' })
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState('')

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
    setPage(1)
    fetchStores()
  }

  const handleCreateStore = async (e) => {
    e.preventDefault()
    setCreateError('')
    setCreating(true)

    // Basic frontend validation
    if (!newStoreData.name || !newStoreData.email || !newStoreData.address) {
      setCreateError('Name, email, and address are required.')
      setCreating(false)
      return
    }

    try {
      // payload expects owner_id as number if provided
      const payload = {
        ...newStoreData,
        owner_id: newStoreData.owner_id ? parseInt(newStoreData.owner_id, 10) : undefined
      }

      await createStore(payload)
      setShowCreateForm(false)
      setNewStoreData({ name: '', email: '', address: '', owner_id: '' })
      setPage(1)
      fetchStores()
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create store.'
      const fieldErrors = err.response?.data?.errors
      if (fieldErrors) {
        const first = Object.values(fieldErrors)[0]
        setCreateError(Array.isArray(first) ? first[0] : first)
      } else {
        setCreateError(msg)
      }
    } finally {
      setCreating(false)
    }
  }

  return (
    <MainLayout>
      <div className="page-container" style={{ padding: 'var(--sp-8) 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-6)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-4)' }}>
            <Link to="/admin" className="btn btn-ghost" style={{ padding: 'var(--sp-2)' }}>&larr; Back</Link>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Manage Stores</h1>
          </div>
          <Button variant="primary" onClick={() => setShowCreateForm(!showCreateForm)}>
            {showCreateForm ? 'Cancel' : 'Add Store'}
          </Button>
        </div>

        {/* Create Store Form */}
        {showCreateForm && (
          <div className="card" style={{ marginBottom: 'var(--sp-6)' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: 'var(--sp-4)' }}>Create New Store</h2>
            {createError && (
              <div style={{ color: 'var(--color-error)', backgroundColor: 'var(--color-error-bg)', padding: 'var(--sp-3)', borderRadius: 'var(--radius)', marginBottom: 'var(--sp-4)' }}>
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
              <Input
                id="owner_id"
                label="Owner ID (Optional)"
                type="number"
                value={newStoreData.owner_id}
                onChange={(e) => setNewStoreData({ ...newStoreData, owner_id: e.target.value })}
                hint="Must belong to a valid STORE_OWNER"
              />
              <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="submit" variant="primary" disabled={creating} style={{ width: '200px' }}>
                  {creating ? 'Creating...' : 'Create Store'}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Controls */}
        <div className="card" style={{ marginBottom: 'var(--sp-6)', padding: 'var(--sp-4)' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: 'var(--sp-4)', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <Input
              id="searchName"
              label="Search by Name"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              style={{ flex: '1 1 150px' }}
            />
            <Input
              id="searchAddress"
              label="Search by Address"
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
              style={{ flex: '1 1 150px' }}
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-1)' }}>
              <label className="input-label" htmlFor="sortBy">Sort By</label>
              <select
                id="sortBy"
                className="input-field"
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                style={{ width: '130px' }}
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
                style={{ width: '110px' }}
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>

            <Button type="submit" variant="primary">Apply</Button>
          </form>
        </div>

        {/* Stores Table */}
        {loading ? (
          <Loader label="Loading stores..." />
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
                {stores.map(store => (
                  <tr key={store.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: 'var(--sp-3) var(--sp-4)', fontSize: '0.9375rem', fontWeight: 500 }}>{store.name}</td>
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
                      {store.average_rating ? Number(store.average_rating).toFixed(1) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.total_pages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 'var(--sp-4)', marginTop: 'var(--sp-8)' }}>
            <Button variant="secondary" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
              Previous
            </Button>
            <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
              Page {page} of {pagination.total_pages}
            </span>
            <Button variant="secondary" disabled={page === pagination.total_pages} onClick={() => setPage(p => p + 1)}>
              Next
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
