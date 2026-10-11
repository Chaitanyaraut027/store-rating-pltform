import { useEffect } from 'react'

/**
 * Reusable modal dialog with backdrop, Escape key handling,
 * outside click dismissal, and accessible role attributes.
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  titleId = 'modal-title',
  maxWidth = '460px',
  children,
}) {
  useEffect(() => {
    if (!isOpen) return

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        padding: 'var(--sp-4)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth,
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.08)',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 'var(--sp-4)',
          }}
        >
          <h2 id={titleId} style={{ fontSize: '1.25rem', fontWeight: 700 }}>
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.25rem',
              color: 'var(--color-text-muted)',
              cursor: 'pointer',
              padding: 'var(--sp-1)',
              lineHeight: 1,
            }}
          >
            &times;
          </button>
        </div>

        {children}
      </div>
    </div>
  )
}
