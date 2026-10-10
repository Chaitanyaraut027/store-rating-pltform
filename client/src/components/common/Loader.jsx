/** Centered spinner used while data is loading. */
export default function Loader({ label = 'Loading…' }) {
  return (
    <div
      role="status"
      aria-label={label}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--sp-3)',
        padding: 'var(--sp-12)',
        color: 'var(--color-text-muted)',
      }}
    >
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ animation: 'spin 0.8s linear infinite', color: 'var(--color-primary)' }}
        aria-hidden="true"
      >
        <path d="M21 12a9 9 0 1 1-6.22-8.56" />
      </svg>
      <span style={{ fontSize: '0.9rem' }}>{label}</span>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
