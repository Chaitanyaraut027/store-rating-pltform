import { useState } from 'react'
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom'
import AuthLayout from '../../layouts/AuthLayout'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import { useAuth } from '../../context/AuthContext'
import { login } from '../../services/auth.service'

const ROLE_HOME = {
  ADMIN: '/admin',
  STORE_OWNER: '/owner',
  USER: '/dashboard',
}

function getErrorMessage(err) {
  return err?.response?.data?.message ?? 'Something went wrong. Please try again.'
}

export default function LoginPage() {
  const { user, saveSession } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Already logged in — go home
  if (user) {
    const dest = location.state?.from?.pathname ?? ROLE_HOME[user.role] ?? '/'
    return <Navigate to={dest} replace />
  }

  function validate() {
    const e = {}
    if (!email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email address'
    if (!password) e.password = 'Password is required'
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setServerError('')

    const fieldErrors = validate()
    if (Object.keys(fieldErrors).length) {
      setErrors(fieldErrors)
      return
    }
    setErrors({})

    try {
      setSubmitting(true)
      const { user, token } = await login(email, password)
      saveSession(user, token)
      const dest = location.state?.from?.pathname ?? ROLE_HOME[user.role] ?? '/'
      navigate(dest, { replace: true })
    } catch (err) {
      setServerError(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout title="Sign in">
      {serverError && (
        <p role="alert" style={{
          fontSize: '0.875rem',
          color: 'var(--color-error)',
          backgroundColor: 'var(--color-error-bg)',
          border: '1px solid #fecaca',
          borderRadius: 'var(--radius)',
          padding: 'var(--sp-3)',
          marginBottom: 'var(--sp-5)',
        }}>
          {serverError}
        </p>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
          <Input
            id="email"
            label="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            required
          />

          <Input
            id="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            required
          />

          <Button type="submit" variant="primary" disabled={submitting} style={{ width: '100%', marginTop: 'var(--sp-2)' }}>
            {submitting ? 'Signing in…' : 'Sign in'}
          </Button>
        </div>
      </form>

      <p style={{ marginTop: 'var(--sp-5)', fontSize: '0.875rem', color: 'var(--color-text-muted)', textAlign: 'center' }}>
        Don&apos;t have an account?{' '}
        <Link to="/register">Create one</Link>
      </p>
    </AuthLayout>
  )
}
