import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'

export default function CheckIn() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ mood_score: 5, note: '', platform: 'Instagram' })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  const platforms = ['Instagram', 'TikTok', 'Twitter', 'Facebook', 'Snapchat', 'YouTube', 'Other']

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const response = await api.post('/checkins/', form)
      if (response.data.message?.includes('successfully')) {
        setResult(response.data.analysis)
      } else {
        setError(response.data.error || response.data.message || 'Check-in failed. Please try again.')
      }
    } catch (err: any) {
      const backendError = err.response?.data?.error || err.response?.data?.detail || err.message
      setError(backendError || 'Something went wrong. Please try again.')
      console.error('Check-in error:', err)
    }
    setLoading(false)
  }

  const getRiskColor = (level: string) => {
    if (level === 'high') return 'text-red-500'
    if (level === 'moderate') return 'text-orange-500'
    return 'text-green-500'
  }

  return (
    <div className="min-h-screen bg-blue-50">
      <nav className="bg-white shadow-sm px-10 py-4 flex justify-between items-center">
        <span className="text-blue-600 text-xl font-bold">WellBeing Analyzer</span>
        <button onClick={() => navigate('/dashboard')} className="text-gray-500 hover:text-blue-600 text-sm font-medium">← Back to Dashboard</button>
      </nav>

      <div className="max-w-xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Mood Check-in</h1>
          <p className="text-gray-500 text-sm mt-1">How are you feeling after using social media?</p>
        </div>

        {!result ? (
          <div className="bg-white rounded-2xl shadow-sm p-8">
            {error && (
              <div className="bg-red-50 text-red-500 text-sm px-4 py-3 rounded-xl mb-6">{error}</div>
            )}
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              
              {/* Mood Score */}
              <div>
                <label htmlFor="mood-score" className="text-gray-600 text-sm font-medium mb-3 block">
                  Mood Score: <span className="text-blue-600 font-bold">{form.mood_score}/10</span>
                </label>
                <input
                  id="mood-score"
                  type="range"
                  min={1}
                  max={10}
                  value={form.mood_score}
                  onChange={(e) => setForm({ ...form, mood_score: parseInt(e.target.value) })}
                  className="w-full accent-blue-600"
                  aria-label="Mood score slider"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>😔 Very Bad</span>
                  <span>😊 Very Good</span>
                </div>
              </div>

              {/* Platform */}
              <div>
                <label htmlFor="platform" className="text-gray-600 text-sm font-medium mb-2 block">Platform</label>
                <select
                  id="platform"
                  value={form.platform}
                  onChange={(e) => setForm({ ...form, platform: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400"
                  aria-label="Social media platform"
                >
                  {platforms.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>

              {/* Note */}
              <div>
                <label className="text-gray-600 text-sm font-medium mb-2 block">How are you feeling? (optional)</label>
                <textarea
                  placeholder="e.g. Everyone looks happier than me on Instagram..."
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 resize-none h-28"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-500 transition"
              >
                {loading ? 'Analyzing...' : 'Submit Check-in'}
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-1">Analysis Complete!</h2>
              <p className="text-gray-500 text-sm">Here's what we found</p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center border border-gray-100 rounded-xl px-4 py-3">
                <span className="text-gray-600 text-sm">Sentiment</span>
                <span className="font-semibold text-blue-600 capitalize">{result.sentiment.sentiment_label}</span>
              </div>
              <div className="flex justify-between items-center border border-gray-100 rounded-xl px-4 py-3">
                <span className="text-gray-600 text-sm">Comparison Index</span>
                <span className="font-semibold text-blue-600">{result.comparison_index}/100</span>
              </div>
              <div className="flex justify-between items-center border border-gray-100 rounded-xl px-4 py-3">
                <span className="text-gray-600 text-sm">Risk Level</span>
                <span className={`font-semibold capitalize ${getRiskColor(result.risk_level)}`}>{result.risk_level}</span>
              </div>
              <div className="mt-2">
                <p className="text-gray-600 text-sm font-medium mb-3">Recommendations:</p>
                {result.recommendations.map((rec: any, i: number) => (
                  <div key={i} className="bg-blue-50 rounded-xl px-4 py-3 mb-2 text-sm text-gray-700">
                    💡 {rec.message}
                  </div>
                ))}
              </div>
              <button
                onClick={() => { setResult(null); setForm({ mood_score: 5, note: '', platform: 'Instagram' }) }}
                className="bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-500 transition mt-2"
              >
                New Check-in
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="border border-blue-600 text-blue-600 py-3 rounded-xl font-semibold hover:bg-blue-50 transition"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}