import axios from 'axios'
import { supabase } from './supabase'

const API_URL = 'http://127.0.0.1:8000'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Automatically attach user ID to every request
api.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession()
  if (session?.user?.id) {
    config.headers['user-id'] = session.user.id
  }
  return config
})

export default api