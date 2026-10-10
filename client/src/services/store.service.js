import api from './api'

export async function getStores(params) {
  const { data } = await api.get('/user/stores', { params })
  return data.data // { stores, pagination }
}

export async function submitRating(store_id, rating) {
  const { data } = await api.post('/ratings', { store_id, rating })
  return data.data // { rating }
}
