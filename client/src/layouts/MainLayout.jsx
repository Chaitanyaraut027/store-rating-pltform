import { Store } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ROLE_HOME = {
  ADMIN: '/admin',
  STORE_OWNER: '/owner',
  USER: '/dashboard',
}

function Navbar() {
  const { user } = useAuth()

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backgroundColor: 'var(--color-surface)',
      borderBottom: '1px solid var(--color-border)',
    }}>
      <div className="page-container" style={{
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--sp-2)',
            color: 'var(--color-text)',
            fontWeight: 700,
            fontSize: '1rem',
            letterSpacing: '-0.01em',
          }}
        >
          <Store size={20} color="var(--color-primary)" aria-hidden="true" />
          Store Rating Platform
        </Link>

        <nav aria-label="Main navigation" style={{ display: 'flex', gap: 'var(--sp-4)', alignItems: 'center' }}>
          {user ? (
            <Link to={ROLE_HOME[user.role] ?? '/'} style={{ fontSize: '0.875rem', fontWeight: 500 }}>
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>
                Sign in
              </Link>
              <Link to="/register" style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--color-border)',
      padding: 'var(--sp-6)',
      textAlign: 'center',
      fontSize: '0.8125rem',
      color: 'var(--color-text-subtle)',
    }}>
      &copy; {new Date().getFullYear()} Store Rating Platform
    </footer>
  )
}

/** Wraps any page with the shared Navbar and Footer. */
export default function MainLayout({ children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        {children}
      </main>
      <Footer />
    </div>
  )
}
