/**
 * Validates an email address.
 */
export function validateEmail(email) {
  if (!email || !email.trim()) return 'Email is required'
  if (!/\S+@\S+\.\S+/.test(email.trim())) return 'Enter a valid email address'
  return null
}

/**
 * Validates a user password according to the platform rules:
 * 8–16 characters, at least one uppercase letter, at least one special character.
 */
export function validatePassword(password) {
  if (!password) return 'Password is required'
  if (password.length < 8 || password.length > 16) {
    return 'Password must be 8–16 characters'
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter'
  }
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    return 'Password must contain at least one special character'
  }
  return null
}

/**
 * Validates a user full name:
 * Must be 20–60 characters.
 */
export function validateName(name) {
  const trimmed = (name || '').trim()
  if (!trimmed) return 'Name is required'
  if (trimmed.length < 20) return 'Name must be at least 20 characters'
  if (trimmed.length > 60) return 'Name must be at most 60 characters'
  return null
}

/**
 * Validates an address:
 * Must not exceed 400 characters.
 */
export function validateAddress(address) {
  const trimmed = (address || '').trim()
  if (!trimmed) return 'Address is required'
  if (trimmed.length > 400) return 'Address must be at most 400 characters'
  return null
}
