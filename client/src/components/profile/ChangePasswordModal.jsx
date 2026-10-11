import { useState } from 'react'
import Modal from '../common/Modal'
import Input from '../common/Input'
import Button from '../common/Button'
import { changePassword } from '../../services/auth.service'
import { getErrorMessage } from '../../utils/errorHandler'
import { validatePassword } from '../../utils/validation'

export default function ChangePasswordModal({ isOpen, onClose }) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function resetState() {
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setErrors({})
    setServerError('')
    setSuccessMessage('')
  }

  function handleClose() {
    resetState()
    onClose()
  }

  function validate() {
    const errs = {}
    if (!currentPassword) {
      errs.currentPassword = 'Current password is required'
    }

    const passwordError = validatePassword(newPassword)
    if (passwordError) {
      errs.newPassword = passwordError
    } else if (currentPassword && newPassword === currentPassword) {
      errs.newPassword = 'New password must be different from current password'
    }

    if (!confirmPassword) {
      errs.confirmPassword = 'Confirm your new password'
    } else if (confirmPassword !== newPassword) {
      errs.confirmPassword = 'Passwords do not match'
    }

    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setServerError('')
    setSuccessMessage('')

    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setErrors({})

    try {
      setSubmitting(true)
      const res = await changePassword(currentPassword, newPassword)
      setSuccessMessage(res.message || 'Password changed successfully!')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setServerError(getErrorMessage(err, 'Failed to change password. Please try again.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Change Password"
      titleId="change-password-title"
      maxWidth="440px"
    >
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
            marginBottom: 'var(--sp-4)',
          }}
        >
          {serverError}
        </p>
      )}

      {successMessage && (
        <p
          role="status"
          style={{
            fontSize: '0.875rem',
            color: 'var(--color-success)',
            backgroundColor: '#ecfdf5',
            border: '1px solid #a7f3d0',
            borderRadius: 'var(--radius)',
            padding: 'var(--sp-3)',
            marginBottom: 'var(--sp-4)',
          }}
        >
          {successMessage}
        </p>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
          <Input
            id="current-password"
            type="password"
            label="Current Password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            error={errors.currentPassword}
            required
          />

          <Input
            id="new-password"
            type="password"
            label="New Password"
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            error={errors.newPassword}
            hint="8–16 chars, 1 uppercase, 1 special char"
            required
          />

          <Input
            id="confirm-password"
            type="password"
            label="Confirm New Password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={errors.confirmPassword}
            required
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--sp-2)', marginTop: 'var(--sp-2)' }}>
            <Button type="button" variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? 'Updating…' : 'Update Password'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  )
}
