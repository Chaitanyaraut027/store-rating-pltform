import api from './api'

export async function login(email, password) {
  const { data } = await api.post('/auth/login', { email, password })
  return data.data // { user, token }
}

export async function register(fields) {
  const { data } = await api.post('/auth/register', fields)
  return data.data // { user, token }
}

export async function getMe() {
  const { data } = await api.get('/auth/me')
  return data.data.user
}
