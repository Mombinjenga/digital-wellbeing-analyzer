import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../utils/supabase'

export default function ResetPassword() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [validSession, setValidSession] = useState(false)

  useEffect(() => {
    // Supabase puts the token in the URL hash — getSession picks it up automatically
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setValidSession(true)
      } else {
        setMessage('❌ Invalid or expired reset link. Please request a new one.')
      }
    })
  }, [])

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) {
      setMessage('❌ Passwords do not match.')
      return
    }
    if (password.length < 6) {
      setMessage('❌ Password must be at least 6 characters.')
      return
    }
    setLoading(true)
    setMessage('')
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) {
        setMessage('❌ ' + error.message)
      } else {
        setMessage('✅ Password updated successfully!')
        setTimeout(() => navigate('/dashboard'), 2000)
      }
    } catch (err: any) {
      setMessage('❌ Something went wrong.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center px-6">
      <div className="bg-white rounded-2xl shadow-sm p-10 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Set New Password</h1>
          <p className="text-gray-500 text-sm">Choose a strong password for your account</p>
        </div>

        {message && (
          <div className={`text-sm px-4 py-3 rounded-xl mb-6 ${message.startsWith('✅') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
            {message}
          </div>
        )}

        {validSession && (
          <form onSubmit={handleReset} className="flex flex-col gap-4">
            <div>
              <label className="text-gray-600 text-sm font-medium mb-1 block">New Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400"
                required
              />
            </div>
            <div>
              <label className="text-gray-600 text-sm font-medium mb-1 block">Confirm Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-500 transition mt-2"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        )}

        <p className="text-center text-gray-500 text-sm mt-6">
          <span
            onClick={() => navigate('/login')}
            className="text-blue-600 font-medium cursor-pointer hover:underline"
          >
            ← Back to Login
          </span>
        </p>
      </div>
    </div>
  )
}