import { Store } from 'lucide-react'
import { Link } from 'react-router-dom'

/** Centered card layout used by Login and Register pages. */
export default function AuthLayout({ title, children }) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--sp-6)',
      backgroundColor: 'var(--color-bg)',
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        {/* Logo */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--sp-2)',
            color: 'var(--color-text)',
            fontWeight: 700,
            fontSize: '1rem',
            marginBottom: 'var(--sp-8)',
            textDecoration: 'none',
          }}
        >
          <Store size={20} color="var(--color-primary)" aria-hidden="true" />
          Store Rating Platform
        </Link>

        {/* Card */}
        <div className="card" style={{ padding: 'var(--sp-8)' }}>
          <h1 style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            color: 'var(--color-text)',
            marginBottom: 'var(--sp-6)',
          }}>
            {title}
          </h1>

          {children}
        </div>
      </div>
    </div>
  )
}
