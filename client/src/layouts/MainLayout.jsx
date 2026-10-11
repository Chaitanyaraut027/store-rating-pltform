import { useState, useEffect, useRef } from 'react'
import { Store, Moon, Sun, User as UserIcon, ChevronDown, KeyRound, LogOut, UserCheck } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import ViewProfileModal from '../components/profile/ViewProfileModal'
import ChangePasswordModal from '../components/profile/ChangePasswordModal'
import { ROLE_HOME } from '../utils/constants'

const CURRENT_YEAR = new Date().getFullYear()

function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') === 'dark' ? 'dark' : 'light'
  })

  const [menuOpen, setMenuOpen] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.removeAttribute('data-theme')
      localStorage.setItem('theme', 'light')
    }
  }, [theme])

  // Close dropdown on outside click or Esc key
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false)
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setMenuOpen(false)
      }
    }

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [menuOpen])

  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))

  const handleLogout = () => {
    setMenuOpen(false)
    logout()
    navigate('/login', { replace: true })
  }

  const handleOpenProfile = () => {
    setMenuOpen(false)
    setShowProfileModal(true)
  }

  const handleOpenPassword = () => {
    setMenuOpen(false)
    setShowPasswordModal(true)
  }

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <div
        className="page-container"
        style={{
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
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
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-text-muted)',
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              padding: 'var(--sp-1)',
            }}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-4)' }}>
              <Link to={ROLE_HOME[user.role] ?? '/'} style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                Dashboard
              </Link>

              {/* Profile dropdown menu */}
              <div ref={menuRef} style={{ position: 'relative' }}>
                <button
                  type="button"
                  id="profile-menu-button"
                  aria-haspopup="true"
                  aria-expanded={menuOpen}
                  aria-label="User account menu"
                  onClick={() => setMenuOpen((prev) => !prev)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--sp-2)',
                    background: 'none',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '4px 8px 4px 6px',
                    cursor: 'pointer',
                    color: 'var(--color-text)',
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-primary-light)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <UserIcon size={16} color="var(--color-primary)" />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', lineHeight: 1.2 }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{user.name}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{user.role}</span>
                  </div>
                  <ChevronDown size={14} color="var(--color-text-muted)" style={{ marginLeft: '4px' }} />
                </button>

                {menuOpen && (
                  <div
                    role="menu"
                    aria-labelledby="profile-menu-button"
                    style={{
                      position: 'absolute',
                      right: 0,
                      marginTop: 'var(--sp-2)',
                      width: '200px',
                      backgroundColor: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius)',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                      zIndex: 60,
                      display: 'flex',
                      flexDirection: 'column',
                      padding: '4px 0',
                    }}
                  >
                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleOpenProfile}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--sp-2)',
                        width: '100%',
                        padding: 'var(--sp-2) var(--sp-4)',
                        fontSize: '0.875rem',
                        color: 'var(--color-text)',
                        background: 'none',
                        border: 'none',
                        textAlign: 'left',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-surface-alt)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <UserCheck size={16} color="var(--color-text-muted)" />
                      View Profile
                    </button>

                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleOpenPassword}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--sp-2)',
                        width: '100%',
                        padding: 'var(--sp-2) var(--sp-4)',
                        fontSize: '0.875rem',
                        color: 'var(--color-text)',
                        background: 'none',
                        border: 'none',
                        textAlign: 'left',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-surface-alt)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <KeyRound size={16} color="var(--color-text-muted)" />
                      Change Password
                    </button>

                    <div style={{ height: '1px', backgroundColor: 'var(--color-border)', margin: '4px 0' }} />

                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleLogout}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--sp-2)',
                        width: '100%',
                        padding: 'var(--sp-2) var(--sp-4)',
                        fontSize: '0.875rem',
                        color: 'var(--color-error)',
                        background: 'none',
                        border: 'none',
                        textAlign: 'left',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-surface-alt)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <LogOut size={16} color="var(--color-error)" />
                      Logout
                    </button>
                  </div>
                )}
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

      {/* Profile and Change Password Modals */}
      <ViewProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        user={user}
      />
      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </header>
  )
}

function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--color-border)',
        padding: 'var(--sp-6)',
        textAlign: 'center',
        fontSize: '0.8125rem',
        color: 'var(--color-text-subtle)',
      }}
    >
      &copy; {CURRENT_YEAR} Store Rating Platform
    </footer>
  )
}

/** Wraps any page with the shared Navbar and Footer. */
export default function MainLayout({ children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
    </div>
  )
}
