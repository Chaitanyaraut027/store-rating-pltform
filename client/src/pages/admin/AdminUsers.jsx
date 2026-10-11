import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import MainLayout from '../../layouts/MainLayout'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Loader from '../../components/common/Loader'
import EmptyState from '../../components/common/EmptyState'
import { getUsers, createUser } from '../../services/admin.service'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, total_pages: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Filters and Sorting
  const [searchName, setSearchName] = useState('')
  const [searchEmail, setSearchEmail] = useState('')
  const [filterRole, setFilterRole] = useState('')
  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState('desc')
  const [page, setPage] = useState(1)

  // Create User Form
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newUserData, setNewUserData] = useState({ name: '', email: '', address: '', password: '', role: 'USER' })
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState('')

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params = {
        page,
        limit: 10,
        sortBy,
        sortOrder,
        ...(searchName.trim() && { name: searchName.trim() }),
        ...(searchEmail.trim() && { email: searchEmail.trim() }),
        ...(filterRole && { role: filterRole })
      }
      const data = await getUsers(params)
      setUsers(data.users)
      setPagination(data.pagination)
    } catch (err) {
      setError('Failed to fetch users. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [page, sortBy, sortOrder, searchName, searchEmail, filterRole])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    fetchUsers()
  }

  const handleCreateUser = async (e) => {
    e.preventDefault()
    setCreateError('')
    setCreating(true)

    // Basic frontend validation
    if (!newUserData.name || !newUserData.email || !newUserData.password || !newUserData.address) {
      setCreateError('All fields are required.')
      setCreating(false)
      return
    }

    try {
      await createUser(newUserData)
      setShowCreateForm(false)
      setNewUserData({ name: '', email: '', address: '', password: '', role: 'USER' })
      setPage(1)
      fetchUsers()
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create user.'
      // Display field errors if available
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
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Manage Users</h1>
          </div>
          <Button variant="primary" onClick={() => setShowCreateForm(!showCreateForm)}>
            {showCreateForm ? 'Cancel' : 'Add User'}
          </Button>
        </div>

        {/* Create User Form */}
        {showCreateForm && (
          <div className="card" style={{ marginBottom: 'var(--sp-6)' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: 'var(--sp-4)' }}>Create New User</h2>
            {createError && (
              <div style={{ color: 'var(--color-error)', backgroundColor: 'var(--color-error-bg)', padding: 'var(--sp-3)', borderRadius: 'var(--radius)', marginBottom: 'var(--sp-4)' }}>
                {createError}
              </div>
            )}
            <form onSubmit={handleCreateUser} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-4)' }}>
              <Input
                id="name"
                label="Full Name"
                value={newUserData.name}
                onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                required
              />
              <Input
                id="email"
                type="email"
                label="Email Address"
                value={newUserData.email}
                onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                required
              />
              <Input
                id="password"
                type="password"
                label="Password"
                value={newUserData.password}
                onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                required
              />
              <Input
                id="address"
                label="Address"
                value={newUserData.address}
                onChange={(e) => setNewUserData({ ...newUserData, address: e.target.value })}
                required
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-1)' }}>
                <label className="input-label" htmlFor="role">Role</label>
                <select
                  id="role"
                  className="input-field"
                  value={newUserData.role}
                  onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
                >
                  <option value="USER">USER</option>
                  <option value="STORE_OWNER">STORE_OWNER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <Button type="submit" variant="primary" disabled={creating} style={{ width: '100%' }}>
                  {creating ? 'Creating...' : 'Create User'}
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
              id="searchEmail"
              label="Search by Email"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              style={{ flex: '1 1 150px' }}
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-1)' }}>
              <label className="input-label" htmlFor="filterRole">Role</label>
              <select
                id="filterRole"
                className="input-field"
                value={filterRole}
                onChange={(e) => { setFilterRole(e.target.value); setPage(1); }}
                style={{ width: '130px' }}
              >
                <option value="">All</option>
                <option value="USER">USER</option>
                <option value="STORE_OWNER">STORE OWNER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-1)' }}>
              <label className="input-label" htmlFor="sortBy">Sort By</label>
              <select
                id="sortBy"
                className="input-field"
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                style={{ width: '130px' }}
              >
                <option value="created_at">Date Joined</option>
                <option value="name">Name</option>
                <option value="email">Email</option>
                <option value="role">Role</option>
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

        {/* Users Table */}
        {loading ? (
          <Loader label="Loading users..." />
        ) : error ? (
          <div style={{ color: 'var(--color-error)', textAlign: 'center', padding: 'var(--sp-8)' }}>
            {error}
          </div>
        ) : users.length === 0 ? (
          <EmptyState title="No users found" message="Try adjusting your search criteria." />
        ) : (
          <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-alt)' }}>
                  <th style={{ padding: 'var(--sp-3) var(--sp-4)', fontWeight: 600, fontSize: '0.875rem' }}>Name</th>
                  <th style={{ padding: 'var(--sp-3) var(--sp-4)', fontWeight: 600, fontSize: '0.875rem' }}>Email</th>
                  <th style={{ padding: 'var(--sp-3) var(--sp-4)', fontWeight: 600, fontSize: '0.875rem' }}>Role</th>
                  <th style={{ padding: 'var(--sp-3) var(--sp-4)', fontWeight: 600, fontSize: '0.875rem' }}>Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: 'var(--sp-3) var(--sp-4)', fontSize: '0.9375rem' }}>{u.name}</td>
                    <td style={{ padding: 'var(--sp-3) var(--sp-4)', fontSize: '0.9375rem', color: 'var(--color-text-muted)' }}>{u.email}</td>
                    <td style={{ padding: 'var(--sp-3) var(--sp-4)', fontSize: '0.9375rem' }}>
                      <span style={{
                        padding: '0.125rem 0.5rem',
                        borderRadius: '1rem',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        backgroundColor: u.role === 'ADMIN' ? '#fee2e2' : u.role === 'STORE_OWNER' ? '#fef3c7' : 'var(--color-primary-light)',
                        color: u.role === 'ADMIN' ? '#991b1b' : u.role === 'STORE_OWNER' ? '#92400e' : 'var(--color-primary)'
                      }}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: 'var(--sp-3) var(--sp-4)', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                      {new Date(u.created_at).toLocaleDateString()}
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
