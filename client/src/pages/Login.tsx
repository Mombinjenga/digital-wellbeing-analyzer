import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../utils/supabase'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      })
      if (authError) {
        setError(authError.message || 'Login failed')
      } else if (data.session) {
        navigate('/dashboard')
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
      console.error('Login error:', err)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center px-6">
      <div className="bg-white rounded-2xl shadow-sm p-10 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome back</h1>
          <p className="text-gray-500 text-sm">Login to your account to continue</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 text-sm px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-gray-600 text-sm font-medium mb-1 block">Email</label>
            <input
              type="email"
              placeholder="email@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400"
              required
            />
          </div>
          <div>
            <label className="text-gray-600 text-sm font-medium mb-1 block">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-500 transition mt-2"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          Don't have an account?{' '}
          <span
            onClick={() => navigate('/register')}
            className="text-blue-600 font-medium cursor-pointer hover:underline"
          >
            Register
          </span>
        </p>
      </div>
    </div>
  )
}