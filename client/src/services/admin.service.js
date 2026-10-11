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

export async function getAllStores() {
  const firstPage = await getStores({ page: 1, limit: 50 })
  let allStores = [...(firstPage.stores || [])]
  const totalPages = firstPage.pagination?.total_pages || 1

  if (totalPages > 1) {
    const pagePromises = []
    for (let p = 2; p <= totalPages; p++) {
      pagePromises.push(getStores({ page: p, limit: 50 }))
    }
    const additionalPages = await Promise.all(pagePromises)
    for (const pageData of additionalPages) {
      if (pageData.stores) {
        allStores = allStores.concat(pageData.stores)
      }
    }
  }

  return allStores
}

export async function createStore(payload) {
  const { data } = await api.post('/admin/stores', payload)
  return data.data.store
}

export async function getStoreOwners() {
  const { data } = await api.get('/admin/store-owners')
  return data.data.store_owners
}
