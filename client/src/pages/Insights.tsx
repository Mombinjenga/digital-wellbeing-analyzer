
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

  const getLast7Days = () => {
    const days = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const label = date.toLocaleDateString('en', { weekday: 'short' }).slice(0, 2)
      const dateStr = date.toLocaleDateString('en-CA')
      const dayCheckins = checkins.filter(c =>
        new Date(c.created_at).toLocaleDateString('en-CA') === dateStr
      )
      const avg = dayCheckins.length > 0
        ? Math.round(dayCheckins.reduce((sum, c) => sum + c.mood_score, 0) / dayCheckins.length)
        : null
      days.push({ label, avg })
    }
    return days
  }

  const getPlatformUsage = () => {
    const counts: Record<string, number> = {}
    checkins.forEach(c => {
      if (c.platform) counts[c.platform] = (counts[c.platform] || 0) + 1
    })
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5)
  }

  const platformColors: Record<string, string> = {
    Instagram: '#f472b6',
    TikTok: '#60a5fa',
    Twitter: '#38bdf8',
    YouTube: '#f87171',
    Facebook: '#818cf8',
    Snapchat: '#facc15',
    Other: '#9ca3af',
  }

  const getTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const days = Math.floor(diff / 86400000)
    const hours = Math.floor(diff / 3600000)
    const mins = Math.floor(diff / 60000)
    if (days > 1) return `${days} days ago`
    if (days === 1) return 'Yesterday'
    if (hours > 0) return `${hours}h ago`
    return `${mins}m ago`
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
              {checkins.length === 0 ? (
                <p className="text-center text-gray-400 text-sm py-10">No check-ins yet — start logging to see your trend!</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', height: '160px', gap: '8px' }}>
                  {moodDays.map((day, i) => (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
                      <span style={{ fontSize: '10px', color: '#60a5fa', marginBottom: '2px' }}>
                        {day.avg ?? ''}
                      </span>
                      <div style={{
                        width: '100%',
                        borderRadius: '4px 4px 0 0',
                        backgroundColor: day.avg !== null ? '#60a5fa' : '#e5e7eb',
                        height: day.avg !== null ? `${(day.avg / 10) * 110}px` : '3px'
                      }} />
                      <span style={{ fontSize: '10px', color: '#9ca3af', marginTop: '4px' }}>
                        {day.label}
                      </span>
                    </div>
                  ))}
                </div>
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
                        <div style={{
                          height: '8px',
                          borderRadius: '999px',
                          backgroundColor: platformColors[platform] || '#9ca3af',
                          width: `${(count / maxPlatformCount) * 100}%`
                        }} />
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