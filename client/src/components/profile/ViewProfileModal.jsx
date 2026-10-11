import Modal from '../common/Modal'
import Button from '../common/Button'
import RoleBadge from '../common/RoleBadge'

export default function ViewProfileModal({ isOpen, onClose, user }) {
  if (!user) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="User Profile"
      titleId="view-profile-title"
      maxWidth="440px"
    >
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
            {user.address || 'No address provided'}
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

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--sp-2)' }}>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  )
}
