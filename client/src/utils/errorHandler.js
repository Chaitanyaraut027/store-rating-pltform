/**
 * Extracts a user-friendly error message from an API error response.
 * Handles both field-level error maps (e.g. from validation libraries)
 * and top-level error message strings.
 */
export function getErrorMessage(err, fallback = 'Something went wrong. Please try again.') {
  if (!err) return fallback

  const fieldErrors = err.response?.data?.errors
  if (fieldErrors && typeof fieldErrors === 'object') {
    const first = Object.values(fieldErrors)[0]
    if (Array.isArray(first) && first.length > 0) return first[0]
    if (typeof first === 'string') return first
  }

  return err.response?.data?.message || err.message || fallback
}
