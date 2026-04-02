import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ full_name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const response = await api.post('/auth/register', form)
      if (response.data.user) {
        navigate('/login')
      } else {
        setError(response.data.error || 'Registration failed')
      }
    } catch (err: any) {
      const backendError = err.response?.data?.detail || err.response?.data?.error
      setError(backendError || err.message || 'Something went wrong. Please try again.')
      console.error('Register error:', err)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center px-6">
      <div className="bg-white rounded-2xl shadow-sm p-10 w-full max-w-md">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Create your account</h1>
          <p className="text-gray-500 text-sm">Start your digital wellness journey today</p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 text-red-500 text-sm px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-gray-600 text-sm font-medium mb-1 block">Full Name</label>
            <input
              type="text"
              placeholder="Full Name"
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400"
              required
            />
          </div>
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
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        {/* Login link */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Already have an account?{' '}
          <span
            onClick={() => navigate('/login')}
            className="text-blue-600 font-medium cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>

      </div>
    </div>
  )
}