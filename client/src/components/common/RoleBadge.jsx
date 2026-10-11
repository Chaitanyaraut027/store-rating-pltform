import { ROLES, ROLE_LABELS } from '../../utils/constants'

const BADGE_STYLES = {
  [ROLES.ADMIN]: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
  },
  [ROLES.STORE_OWNER]: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
  },
  [ROLES.USER]: {
    backgroundColor: 'var(--color-primary-light)',
    color: 'var(--color-primary)',
  },
}

/**
 * Reusable badge indicating user role with consistent styling.
 */
export default function RoleBadge({ role, showLabel = false }) {
  const style = BADGE_STYLES[role] || {
    backgroundColor: 'var(--color-surface-alt)',
    color: 'var(--color-text-muted)',
  }

  const displayText = showLabel ? (ROLE_LABELS[role] || role) : role

  return (
    <span
      style={{
        display: 'inline-block',
        padding: '0.125rem 0.5rem',
        borderRadius: '1rem',
        fontSize: '0.75rem',
        fontWeight: 600,
        ...style,
      }}
    >
      {displayText}
    </span>
  )
}
