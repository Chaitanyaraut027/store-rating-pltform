import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import MainLayout from '../../layouts/MainLayout'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Loader from '../../components/common/Loader'
import EmptyState from '../../components/common/EmptyState'
import Pagination from '../../components/common/Pagination'
import RoleBadge from '../../components/common/RoleBadge'
import UserDetailsModal from '../../components/admin/UserDetailsModal'
import { getUsers, createUser } from '../../services/admin.service'
import { ROLES } from '../../utils/constants'
import { getErrorMessage } from '../../utils/errorHandler'
import { formatDate } from '../../utils/formatters'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, total_pages: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Search input state (buffered until Apply is clicked)
  const [inputName, setInputName] = useState('')
  const [inputEmail, setInputEmail] = useState('')
  const [inputAddress, setInputAddress] = useState('')

  // Applied Filters and Sorting
  const [searchName, setSearchName] = useState('')
  const [searchEmail, setSearchEmail] = useState('')
  const [searchAddress, setSearchAddress] = useState('')
  const [filterRole, setFilterRole] = useState('')
  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState('desc')
  const [page, setPage] = useState(1)
  const [refreshKey, setRefreshKey] = useState(0)

  // User Details Modal
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  // Create User Form
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
    role: ROLES.USER,
  })
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState('')

  useEffect(() => {
    let isSubscribed = true

    async function loadUsers() {
      try {
        const params = {
          page,
          limit: 10,
          sortBy,
          sortOrder,
          ...(searchName.trim() && { name: searchName.trim() }),
          ...(searchEmail.trim() && { email: searchEmail.trim() }),
          ...(searchAddress.trim() && { address: searchAddress.trim() }),
          ...(filterRole && { role: filterRole }),
        }
        const data = await getUsers(params)
        if (!isSubscribed) return
        setUsers(data.users || [])
        setPagination(data.pagination || { page: 1, limit: 10, total: 0, total_pages: 0 })
        setError('')
      } catch (err) {
        if (!isSubscribed) return
        setError(getErrorMessage(err, 'Failed to fetch users. Please try again.'))
      } finally {
        if (isSubscribed) setLoading(false)
      }
    }

    loadUsers()

    return () => {
      isSubscribed = false
    }
  }, [page, sortBy, sortOrder, searchName, searchEmail, searchAddress, filterRole, refreshKey])

  const handleSearch = (e) => {
    e.preventDefault()
    setLoading(true)
    setPage(1)
    setSearchName(inputName)
    setSearchEmail(inputEmail)
    setSearchAddress(inputAddress)
    setRefreshKey((k) => k + 1)
  }

  const handlePageChange = (newPage) => {
    setLoading(true)
    setPage(newPage)
  }

  const handleFilterRoleChange = (e) => {
    setLoading(true)
    setFilterRole(e.target.value)
    setPage(1)
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

  const handleViewDetails = (userId) => {
    setSelectedUserId(userId)
    setShowDetailsModal(true)
  }

  const handleCreateUser = async (e) => {
    e.preventDefault()
    setCreateError('')

    if (
      !newUserData.name.trim() ||
      !newUserData.email.trim() ||
      !newUserData.password ||
      !newUserData.address.trim()
    ) {
      setCreateError('All fields are required.')
      return
    }

    try {
      setCreating(true)
      await createUser({
        name: newUserData.name.trim(),
        email: newUserData.email.trim(),
        address: newUserData.address.trim(),
        password: newUserData.password,
        role: newUserData.role,
      })
      setShowCreateForm(false)
      setNewUserData({ name: '', email: '', address: '', password: '', role: ROLES.USER })
      setLoading(true)
      setPage(1)
      setRefreshKey((k) => k + 1)
    } catch (err) {
      setCreateError(getErrorMessage(err, 'Failed to create user.'))
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
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Manage Users</h1>
          </div>
          <Button variant="primary" onClick={() => setShowCreateForm(!showCreateForm)}>
            {showCreateForm ? 'Cancel' : 'Add User'}
          </Button>
        </div>

        {/* Create User Form */}
        {showCreateForm && (
          <div className="card" style={{ marginBottom: 'var(--sp-6)' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: 'var(--sp-4)' }}>
              Create New User
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
                <label className="input-label" htmlFor="role">
                  Role
                </label>
                <select
                  id="role"
                  className="input-field"
                  value={newUserData.role}
                  onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
                >
                  <option value={ROLES.USER}>USER</option>
                  <option value={ROLES.STORE_OWNER}>STORE_OWNER</option>
                  <option value={ROLES.ADMIN}>ADMIN</option>
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <Button type="submit" variant="primary" disabled={creating} style={{ width: '100%' }}>
                  {creating ? 'Creating…' : 'Create User'}
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
              id="searchEmail"
              label="Search by Email"
              value={inputEmail}
              onChange={(e) => setInputEmail(e.target.value)}
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
              <label className="input-label" htmlFor="filterRole">
                Role
              </label>
              <select
                id="filterRole"
                className="input-field"
                value={filterRole}
                onChange={handleFilterRoleChange}
                style={{ width: '130px' }}
              >
                <option value="">All</option>
                <option value={ROLES.USER}>USER</option>
                <option value={ROLES.STORE_OWNER}>STORE OWNER</option>
                <option value={ROLES.ADMIN}>ADMIN</option>
              </select>
            </div>

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
                <option value="created_at">Date Joined</option>
                <option value="name">Name</option>
                <option value="email">Email</option>
                <option value="address">Address</option>
                <option value="role">Role</option>
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

        {/* Users Table */}
        {loading ? (
          <Loader label="Loading users…" />
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
                  <th style={{ padding: 'var(--sp-3) var(--sp-4)', fontWeight: 600, fontSize: '0.875rem' }}>Address</th>
                  <th style={{ padding: 'var(--sp-3) var(--sp-4)', fontWeight: 600, fontSize: '0.875rem' }}>Role</th>
                  <th style={{ padding: 'var(--sp-3) var(--sp-4)', fontWeight: 600, fontSize: '0.875rem' }}>Joined</th>
                  <th style={{ padding: 'var(--sp-3) var(--sp-4)', fontWeight: 600, fontSize: '0.875rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: 'var(--sp-3) var(--sp-4)', fontSize: '0.9375rem', fontWeight: 500 }}>{u.name}</td>
                    <td style={{ padding: 'var(--sp-3) var(--sp-4)', fontSize: '0.9375rem', color: 'var(--color-text-muted)' }}>{u.email}</td>
                    <td style={{ padding: 'var(--sp-3) var(--sp-4)', fontSize: '0.875rem', color: 'var(--color-text-muted)', maxWidth: '240px', wordBreak: 'break-word' }}>
                      {u.address || '—'}
                    </td>
                    <td style={{ padding: 'var(--sp-3) var(--sp-4)', fontSize: '0.9375rem' }}>
                      <RoleBadge role={u.role} />
                    </td>
                    <td style={{ padding: 'var(--sp-3) var(--sp-4)', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                      {formatDate(u.created_at)}
                    </td>
                    <td style={{ padding: 'var(--sp-3) var(--sp-4)', textAlign: 'right' }}>
                      <Button
                        variant="secondary"
                        onClick={() => handleViewDetails(u.id)}
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                      >
                        View Details
                      </Button>
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

        {/* User Details Modal */}
        <UserDetailsModal
          isOpen={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false)
            setSelectedUserId(null)
          }}
          userId={selectedUserId}
        />
      </div>
    </MainLayout>
  )
}
