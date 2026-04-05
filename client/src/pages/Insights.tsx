import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'

export default function Insights() {
  const navigate = useNavigate()
  const [checkins, setCheckins] = useState<any[]>([])
  const [scores, setScores] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [checkinsRes, scoresRes] = await Promise.all([
          api.get('/checkins/'),
          api.get('/scores/')
        ])
        setCheckins(checkinsRes.data.data || [])
        setScores(scoresRes.data.data || [])
      } catch (err) {
        console.error('Failed to fetch insights:', err)
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  // Build last 7 days mood trend
  const getLast7Days = () => {
    const days = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const label = date.toLocaleDateString('en', { weekday: 'short' }).charAt(0)
      const dateStr = date.toDateString()
      const dayCheckins = checkins.filter(c => new Date(c.created_at).toDateString() === dateStr)
      const avg = dayCheckins.length > 0
        ? Math.round(dayCheckins.reduce((sum, c) => sum + c.mood_score, 0) / dayCheckins.length)
        : null
      days.push({ label, avg })
    }
    return days
  }

  // Count check-ins per platform
  const getPlatformUsage = () => {
    const counts: Record<string, number> = {}
    checkins.forEach(c => {
      if (c.platform) counts[c.platform] = (counts[c.platform] || 0) + 1
    })
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
  }

  const platformColors: Record<string, string> = {
    Instagram: 'bg-pink-400',
    TikTok: 'bg-blue-400',
    Twitter: 'bg-sky-400',
    YouTube: 'bg-red-400',
    Facebook: 'bg-indigo-400',
    Snapchat: 'bg-yellow-400',
    Other: 'bg-gray-400',
  }

  const getTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const days = Math.floor(diff / 86400000)
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    return `${days} days ago`
  }

  const moodDays = getLast7Days()
  const platformUsage = getPlatformUsage()
  const maxPlatformCount = platformUsage[0]?.[1] || 1

  return (
    <div className="min-h-screen bg-blue-50">
      <nav className="bg-white shadow-sm px-10 py-4 flex justify-between items-center">
        <span className="text-blue-600 text-xl font-bold">WellBeing Analyzer</span>
        <button onClick={() => navigate('/dashboard')} className="text-gray-500 hover:text-blue-600 text-sm font-medium">← Back to Dashboard</button>
      </nav>

      <div className="px-10 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Insights & Trends</h1>
          <p className="text-gray-500 text-sm mt-1">Your emotional patterns over time</p>
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-20">Loading your insights...</div>
        ) : (
          <>
            {/* Mood Trend */}
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
              <h2 className="text-gray-800 font-bold mb-4">Weekly Mood Trend</h2>
              <div className="flex items-end gap-3 h-32">
                {moodDays.map((day, i) => (
                  <div key={i} className="flex flex-col items-center flex-1">
                    {day.avg !== null ? (
                      <div
                        className={`bg-blue-400 rounded-t-lg w-full transition-all h-[${day.avg * 10}%]`}
                        title={`Mood: ${day.avg}/10`}
                      />
                    ) : (
                      <div className="bg-gray-100 rounded-t-lg w-full h-[10%]" />
                    )}
                    <span className="text-xs text-gray-400 mt-1">{day.label}</span>
                  </div>
                ))}
              </div>
              {checkins.length === 0 && (
                <p className="text-center text-gray-400 text-sm mt-4">No check-ins yet — start logging to see your trend!</p>
              )}
            </div>

            {/* Platform Usage */}
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
              <h2 className="text-gray-800 font-bold mb-4">Platform Usage (Check-ins)</h2>
              {platformUsage.length === 0 ? (
                <p className="text-gray-400 text-sm">No platform data yet.</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {platformUsage.map(([platform, count], i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">{platform}</span>
                        <span className="text-gray-400">{count} check-in{count > 1 ? 's' : ''}</span>
                      </div>
                      <div className="bg-gray-100 rounded-full h-2">
                        <div
                          className={`${platformColors[platform] || 'bg-gray-400'} h-2 rounded-full w-[${(count / maxPlatformCount) * 100}%]`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Comparison Risk History */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-gray-800 font-bold mb-4">Comparison Risk History</h2>
              {scores.length === 0 ? (
                <p className="text-gray-400 text-sm">No risk scores yet.</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {scores.slice(0, 7).map((item, i) => (
                    <div key={i} className="flex justify-between items-center border border-gray-100 rounded-xl px-4 py-3">
                      <span className="text-gray-600 text-sm">{getTimeAgo(item.created_at)}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-gray-400 text-sm">{item.comparison_index}/100</span>
                        <span className={`text-xs font-semibold capitalize px-3 py-1 rounded-full ${
                          item.risk_level === 'high' ? 'bg-red-100 text-red-500' :
                          item.risk_level === 'moderate' ? 'bg-orange-100 text-orange-500' :
                          'bg-green-100 text-green-500'
                        }`}>{item.risk_level}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}