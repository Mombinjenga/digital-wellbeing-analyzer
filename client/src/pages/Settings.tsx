
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../utils/supabase'

export default function Settings() {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [notifications, setNotifications] = useState(true)
  const [dailyReminder, setDailyReminder] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setEmail(user.email || '')
        setFullName(user.user_metadata?.full_name || '')
      }
    }
    loadUser()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setMessage('')
    try {
      const { error } = await supabase.auth.updateUser({
        email,
        data: { full_name: fullName }
      })
      if (error) {
        setMessage('❌ ' + error.message)
      } else {
        setMessage('✅ Changes saved successfully!')
      }
    } catch (err: any) {
      setMessage('❌ Something went wrong.')
    }
    setSaving(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    localStorage.clear()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-blue-50">
      <nav className="bg-white shadow-sm px-10 py-4 flex justify-between items-center">
        <span className="text-blue-600 text-xl font-bold">WellBeing Analyzer</span>
        <button onClick={() => navigate('/dashboard')} className="text-gray-500 hover:text-blue-600 text-sm font-medium">← Back to Dashboard</button>
      </nav>

      <div className="max-w-xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your account and preferences</p>
        </div>

        {/* Profile */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-gray-800 font-bold mb-4">Profile</h2>
          <div className="flex flex-col gap-4">
            {message && (
              <div className={`text-sm px-4 py-3 rounded-xl ${message.startsWith('✅') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                {message}
              </div>
            )}
            <div>
              <label htmlFor="fullName" className="text-gray-600 text-sm font-medium mb-1 block">Full Name</label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400"
              />
            </div>
            <div>
              <label htmlFor="email" className="text-gray-600 text-sm font-medium mb-1 block">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400"
              />
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-500 transition"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-gray-800 font-bold mb-4">Notifications</h2>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-700 text-sm font-medium">Push Notifications</p>
                <p className="text-gray-400 text-xs">Receive alerts about your well-being</p>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                aria-label="Toggle push notifications"
                className={`w-12 h-6 rounded-full transition ${notifications ? 'bg-blue-600' : 'bg-gray-300'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform mx-0.5 ${notifications ? 'translate-x-6' : ''}`} />
              </button>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-700 text-sm font-medium">Daily Reminder</p>
                <p className="text-gray-400 text-xs">Remind me to do a mood check-in</p>
              </div>
              <button
                onClick={() => setDailyReminder(!dailyReminder)}
                aria-label="Toggle daily reminder"
                className={`w-12 h-6 rounded-full transition ${dailyReminder ? 'bg-blue-600' : 'bg-gray-300'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform mx-0.5 ${dailyReminder ? 'translate-x-6' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-red-500 font-bold mb-4">Danger Zone</h2>
          <button
            onClick={handleLogout}
            className="w-full border border-red-400 text-red-500 py-3 rounded-xl font-semibold hover:bg-red-50 transition"
          >
            Logout
          </button>
        </div>

      </div>
    </div>
  )
}