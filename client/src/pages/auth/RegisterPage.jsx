import { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import AuthLayout from '../../layouts/AuthLayout'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import { useAuth } from '../../context/AuthContext'
import { register } from '../../services/auth.service'

function getErrorMessage(err) {
  // Surface the first field-level error if the backend returns them
  const fieldErrors = err?.response?.data?.errors
  if (fieldErrors) {
    const first = Object.values(fieldErrors)[0]
    return Array.isArray(first) ? first[0] : first
  }
  return err?.response?.data?.message ?? 'Something went wrong. Please try again.'
}

const EMPTY = { name: '', email: '', address: '', password: '' }

export default function RegisterPage() {
  const { user, saveSession } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Already logged in — send home
  if (user) return <Navigate to="/" replace />

  function set(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  function validate() {
    const e = {}
    if (!form.name.trim()) {
      e.name = 'Name is required'
    } else if (form.name.trim().length < 20) {
      e.name = 'Name must be at least 20 characters'
    } else if (form.name.trim().length > 60) {
      e.name = 'Name must be at most 60 characters'
    }

    if (!form.email) {
      e.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      e.email = 'Enter a valid email address'
    }

    if (!form.address.trim()) {
      e.address = 'Address is required'
    } else if (form.address.trim().length > 400) {
      e.address = 'Address must be at most 400 characters'
    }

    if (!form.password) {
      e.password = 'Password is required'
    } else if (form.password.length < 8 || form.password.length > 16) {
      e.password = 'Password must be 8–16 characters'
    } else if (!/[A-Z]/.test(form.password)) {
      e.password = 'Password must contain at least one uppercase letter'
    } else if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(form.password)) {
      e.password = 'Password must contain at least one special character'
    }

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
      // Role is not sent — backend always creates normal USER accounts via this endpoint
      const { user, token } = await register({
        name: form.name.trim(),
        email: form.email.trim(),
        address: form.address.trim(),
        password: form.password,
      })
      saveSession(user, token)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setServerError(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout title="Create an account">
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
            id="name"
            label="Full name"
            autoComplete="name"
            value={form.name}
            onChange={set('name')}
            error={errors.name}
            hint="20–60 characters"
            required
          />

          <Input
            id="email"
            label="Email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={set('email')}
            error={errors.email}
            required
          />

          <Input
            id="address"
            label="Address"
            autoComplete="street-address"
            value={form.address}
            onChange={set('address')}
            error={errors.address}
            required
          />

          <Input
            id="password"
            label="Password"
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={set('password')}
            error={errors.password}
            hint="8–16 characters, one uppercase, one special character"
            required
          />

          <Button type="submit" variant="primary" disabled={submitting} style={{ width: '100%', marginTop: 'var(--sp-2)' }}>
            {submitting ? 'Creating account…' : 'Create account'}
          </Button>
        </div>
      </form>

      <p style={{ marginTop: 'var(--sp-5)', fontSize: '0.875rem', color: 'var(--color-text-muted)', textAlign: 'center' }}>
        Already have an account?{' '}
        <Link to="/login">Sign in</Link>
      </p>
    </AuthLayout>
  )
}
