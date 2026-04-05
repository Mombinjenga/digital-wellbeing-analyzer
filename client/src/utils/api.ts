import axios from 'axios'
import { supabase } from './supabase'

const API_URL = 'http://127.0.0.1:8000'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use(async (config) => {
  // Try Supabase JS session first (new login flow)
  const { data: { session } } = await supabase.auth.getSession()
  if (session?.user?.id) {
    config.headers['user-id'] = session.user.id
    return config
  }

  // Fallback: decode from JWT in localStorage (old login flow)
  const token = localStorage.getItem('access_token')
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      if (payload.sub) config.headers['user-id'] = payload.sub
    } catch (e) {
      console.error('Failed to decode token:', e)
    }
  }

  return config
})

export default api