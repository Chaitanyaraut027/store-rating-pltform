import { useState, useEffect } from 'react'
import Modal from '../common/Modal'
import Loader from '../common/Loader'
import Button from '../common/Button'
import RoleBadge from '../common/RoleBadge'
import { getUser, getAllStores } from '../../services/admin.service'
import { formatDate, formatRating } from '../../utils/formatters'
import { getErrorMessage } from '../../utils/errorHandler'

export default function UserDetailsModal({ isOpen, onClose, userId }) {
  const [user, setUser] = useState(null)
  const [stores, setStores] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingStores, setLoadingStores] = useState(false)
  const [error, setError] = useState('')
  const [storesError, setStoresError] = useState('')

  useEffect(() => {
    if (!isOpen || !userId) {
      return
    }

    let isSubscribed = true

    async function loadData() {
      try {
        const fetchedUser = await getUser(userId)
        if (!isSubscribed) return
        setUser(fetchedUser)

        // If the user is a STORE_OWNER, fetch all stores to display ownership list
        if (fetchedUser && fetchedUser.role === 'STORE_OWNER') {
          setLoadingStores(true)
          try {
            const allStores = await getAllStores()
            if (!isSubscribed) return
            const matchedStores = allStores.filter(
              (s) => String(s.owner_id) === String(fetchedUser.id)
            )
            setStores(matchedStores)
          } catch {
            if (!isSubscribed) return
            setStoresError('Failed to load owned stores.')
          } finally {
            if (isSubscribed) setLoadingStores(false)
          }
        }
      } catch (err) {
        if (!isSubscribed) return
        setError(getErrorMessage(err, 'Failed to load user details.'))
      } finally {
        if (isSubscribed) setLoading(false)
      }
    }

    loadData()

    return () => {
      isSubscribed = false
    }
  }, [isOpen, userId])

  const handleClose = () => {
    setUser(null)
    setStores([])
    setError('')
    setStoresError('')
    setLoading(true)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="User Details"
      titleId="user-details-title"
      maxWidth="560px"
    >
      {loading ? (
        <div style={{ padding: 'var(--sp-6) 0' }}>
          <Loader label="Loading user details…" />
        </div>
      ) : error ? (
        <div
          style={{
            color: 'var(--color-error)',
            backgroundColor: 'var(--color-error-bg)',
            padding: 'var(--sp-3)',
            borderRadius: 'var(--radius)',
            marginBottom: 'var(--sp-4)',
          }}
        >
          {error}
        </div>
      ) : user ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              Name
            </span>
            <p style={{ fontSize: '1rem', fontWeight: 600, marginTop: '2px' }}>{user.name}</p>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              Email Address
            </span>
            <p style={{ fontSize: '0.9375rem', marginTop: '2px' }}>{user.email}</p>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              Address
            </span>
            <p style={{ fontSize: '0.9375rem', marginTop: '2px', wordBreak: 'break-word' }}>
              {user.address || '—'}
            </p>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              Role
            </span>
            <p style={{ marginTop: '2px' }}>
              <RoleBadge role={user.role} />
            </p>
          </div>

          {user.created_at && (
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                Member Since
              </span>
              <p style={{ fontSize: '0.9375rem', marginTop: '2px', color: 'var(--color-text-muted)' }}>
                {formatDate(user.created_at)}
              </p>
            </div>
          )}

          {/* Owned Stores section for STORE_OWNER */}
          {user.role === 'STORE_OWNER' && (
            <div
              style={{
                borderTop: '1px solid var(--color-border)',
                paddingTop: 'var(--sp-4)',
                marginTop: 'var(--sp-2)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-3)' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Owned Stores</h3>
                {!loadingStores && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    {stores.length} store{stores.length === 1 ? '' : 's'}
                  </span>
                )}
              </div>

              {loadingStores ? (
                <div style={{ padding: 'var(--sp-4) 0' }}>
                  <Loader label="Loading owned stores…" />
                </div>
              ) : storesError ? (
                <div
                  style={{
                    color: 'var(--color-error)',
                    backgroundColor: 'var(--color-error-bg)',
                    padding: 'var(--sp-2) var(--sp-3)',
                    borderRadius: 'var(--radius)',
                    fontSize: '0.875rem',
                  }}
                >
                  {storesError}
                </div>
              ) : stores.length === 0 ? (
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                  No stores assigned to this owner yet.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
                  {stores.map((store) => (
                    <div
                      key={store.id}
                      style={{
                        padding: 'var(--sp-3)',
                        borderRadius: 'var(--radius)',
                        border: '1px solid var(--color-border)',
                        backgroundColor: 'var(--color-surface-alt)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 'var(--sp-2)',
                      }}
                    >
                      <div style={{ flex: '1 1 200px' }}>
                        <h4 style={{ fontSize: '0.9375rem', fontWeight: 600 }}>{store.name}</h4>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginTop: '2px', wordBreak: 'break-word' }}>
                          {store.address}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>
                          Avg Rating
                        </span>
                        <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                          {store.average_rating ? `${formatRating(store.average_rating)} / 5` : '—'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--sp-2)' }}>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </div>
        </div>
      ) : null}
    </Modal>
  )
}
