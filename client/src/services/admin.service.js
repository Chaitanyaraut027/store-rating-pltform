import api from './api'

// Dashboard Stats
export async function getDashboardStats() {
  const { data } = await api.get('/admin/dashboard')
  return data.data
}

// User Management
export async function getUsers(params) {
  const { data } = await api.get('/admin/users', { params })
  return data.data // { users, pagination }
}

export async function getUser(id) {
  const { data } = await api.get(`/admin/users/${id}`)
  return data.data.user
}

export async function createUser(payload) {
  const { data } = await api.post('/admin/users', payload)
  return data.data.user
}

// Store Management
export async function getStores(params) {
  const { data } = await api.get('/admin/stores', { params })
  return data.data // { stores, pagination }
}

export async function createStore(payload) {
  const { data } = await api.post('/admin/stores', payload)
  return data.data.store
}
