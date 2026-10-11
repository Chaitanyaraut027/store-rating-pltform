/**
 * Formats an ISO date string to a localized date.
 */
export function formatDate(dateString) {
  if (!dateString) return '—'
  const date = new Date(dateString)
  return isNaN(date.getTime()) ? '—' : date.toLocaleDateString()
}

/**
 * Formats a rating value to one decimal place, or returns a fallback.
 */
export function formatRating(rating, fallback = '—') {
  if (rating === null || rating === undefined || rating === '') return fallback
  const num = Number(rating)
  return isNaN(num) ? fallback : num.toFixed(1)
}
