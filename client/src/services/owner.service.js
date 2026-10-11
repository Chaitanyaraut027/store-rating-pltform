import api from './api'

// Fetches stores owned by the current user with average_rating and total_ratings.
export async function getOwnerDashboard() {
  const { data } = await api.get('/owner/dashboard')
  return data.data // { stores }
}

// Fetches all ratings submitted for the owner's stores.
export async function getOwnerRatings() {
  const { data } = await api.get('/owner/ratings')
  return data.data // { ratings }
}
