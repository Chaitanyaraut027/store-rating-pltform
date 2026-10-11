import { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import AuthLayout from '../../layouts/AuthLayout'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import { useAuth } from '../../hooks/useAuth'
import { register } from '../../services/auth.service'
import { getErrorMessage } from '../../utils/errorHandler'
import {
  validateName,
  validateEmail,
  validateAddress,
  validatePassword,
} from '../../utils/validation'

const INITIAL_FORM_STATE = { name: '', email: '', address: '', password: '' }

export default function RegisterPage() {
  const { user, saveSession } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState(INITIAL_FORM_STATE)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Already logged in — redirect to home
  if (user) return <Navigate to="/" replace />

  function handleChange(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  function validate() {
    const errs = {}
    const nameErr = validateName(form.name)
    if (nameErr) errs.name = nameErr

    const emailErr = validateEmail(form.email)
    if (emailErr) errs.email = emailErr

    const addressErr = validateAddress(form.address)
    if (addressErr) errs.address = addressErr

    const passwordErr = validatePassword(form.password)
    if (passwordErr) errs.password = passwordErr

    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setServerError('')

    const fieldErrors = validate()
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors)
      return
    }
    setErrors({})

    try {
      setSubmitting(true)
      // Normal USER accounts are created via this registration endpoint
      const { user: registeredUser, token } = await register({
        name: form.name.trim(),
        email: form.email.trim(),
        address: form.address.trim(),
        password: form.password,
      })
      saveSession(registeredUser, token)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setServerError(getErrorMessage(err, 'Failed to create account. Please try again.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout title="Create an account">
      {serverError && (
        <p
          role="alert"
          style={{
            fontSize: '0.875rem',
            color: 'var(--color-error)',
            backgroundColor: 'var(--color-error-bg)',
            border: '1px solid #fecaca',
            borderRadius: 'var(--radius)',
            padding: 'var(--sp-3)',
            marginBottom: 'var(--sp-5)',
          }}
        >
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
            onChange={handleChange('name')}
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
            onChange={handleChange('email')}
            error={errors.email}
            required
          />

          <Input
            id="address"
            label="Address"
            autoComplete="street-address"
            value={form.address}
            onChange={handleChange('address')}
            error={errors.address}
            hint="Maximum 400 characters"
            required
          />

          <Input
            id="password"
            label="Password"
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={handleChange('password')}
            error={errors.password}
            hint="8–16 characters, one uppercase, one special character"
            required
          />

          <Button
            type="submit"
            variant="primary"
            disabled={submitting}
            style={{ width: '100%', marginTop: 'var(--sp-2)' }}
          >
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
