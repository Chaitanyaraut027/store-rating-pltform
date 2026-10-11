import { useState, useEffect } from 'react'
import { Store, Moon, Sun, User as UserIcon } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Button from '../components/common/Button'

const ROLE_HOME = {
  ADMIN: '/admin',
  STORE_OWNER: '/owner',
  USER: '/dashboard',
}

function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [theme, setTheme] = useState(() => {
    return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'
  })

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.removeAttribute('data-theme')
      localStorage.setItem('theme', 'light')
    }
  }, [theme])

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark')

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backgroundColor: 'var(--color-surface)',
      borderBottom: '1px solid var(--color-border)',
    }}>
      <div className="page-container" style={{
        height: '64px',
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

        <nav aria-label="Main navigation" style={{ display: 'flex', gap: 'var(--sp-6)', alignItems: 'center' }}>
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-text-muted)',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-4)' }}>
              <Link to={ROLE_HOME[user.role] ?? '/'} style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                Dashboard
              </Link>

              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', borderLeft: '1px solid var(--color-border)', paddingLeft: 'var(--sp-4)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <UserIcon size={16} color="var(--color-primary)" />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{user.name}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{user.role}</span>
                  </div>
                </div>
                <Button variant="secondary" onClick={handleLogout} style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                  Logout
                </Button>
              </div>
            </div>
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
