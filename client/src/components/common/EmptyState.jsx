import { Inbox } from 'lucide-react'

/**
 * EmptyState — shown when a list or section has no content.
 * `action` is an optional React node (e.g. a Button) rendered below the message.
 */
export default function EmptyState({ title = 'Nothing here yet', message, action }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--sp-3)',
        padding: 'var(--sp-16) var(--sp-6)',
        textAlign: 'center',
        color: 'var(--color-text-muted)',
      }}
    >
      <Inbox size={40} strokeWidth={1.5} aria-hidden="true" />

      <p style={{ fontWeight: 600, color: 'var(--color-text)', fontSize: '1rem' }}>
        {title}
      </p>

      {message && (
        <p style={{ fontSize: '0.9rem', maxWidth: '340px', lineHeight: 1.6 }}>
          {message}
        </p>
      )}

      {action && <div style={{ marginTop: 'var(--sp-2)' }}>{action}</div>}
    </div>
  )
}
