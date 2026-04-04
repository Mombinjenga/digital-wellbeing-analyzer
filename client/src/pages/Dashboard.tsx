import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'

export default function Dashboard() {
  const navigate = useNavigate()
  const [checkins, setCheckins] = useState<any[]>([])
  const [latestScore, setLatestScore] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [checkinsRes, scoresRes] = await Promise.all([
          api.get('/checkins/'),
          api.get('/scores/')
        ])
        setCheckins(checkinsRes.data.data || [])
        const scores = scoresRes.data.data || []
        if (scores.length > 0) setLatestScore(scores[0])
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err)
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  const todaysMood = checkins.find(c => {
    const date = new Date(c.created_at)
    return date.toDateString() === new Date().toDateString()
  })

  const yesterdaysMood = checkins.find(c => {
    const date = new Date(c.created_at)
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    return date.toDateString() === yesterday.toDateString()
  })

  const getRiskColor = (level: string) => {
    if (level === 'high') return 'text-red-500'
    if (level === 'moderate') return 'text-orange-500'
    return 'text-green-500'
  }

  const getTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    const hours = Math.floor(mins / 60)
    const days = Math.floor(hours / 24)
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`
    return `${mins} minute${mins > 1 ? 's' : ''} ago`
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="min-h-screen bg-blue-50">

      {/* Navbar */}
      <nav className="bg-white shadow-sm px-10 py-4 flex justify-between items-center">
        <span className="text-blue-600 text-xl font-bold">WellBeing Analyzer</span>
        <div className="flex gap-6">
          <button onClick={() => navigate('/checkin')} className="text-gray-500 hover:text-blue-600 text-sm font-medium">Check In</button>
          <button onClick={() => navigate('/insights')} className="text-gray-500 hover:text-blue-600 text-sm font-medium">Insights</button>
          <button onClick={() => navigate('/recommendations')} className="text-gray-500 hover:text-blue-600 text-sm font-medium">Recommendations</button>
          <button onClick={() => navigate('/settings')} className="text-gray-500 hover:text-blue-600 text-sm font-medium">Settings</button>
        </div>
      </nav>

      <div className="px-10 py-10">

        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">{getGreeting()}! 👋</h1>
          <p className="text-gray-500 text-sm mt-1">Here's your digital well-being summary</p>
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-20">Loading your data...</div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

              {/* Today's Mood */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <p className="text-gray-500 text-sm mb-1">Today's Mood</p>
                {todaysMood ? (
                  <>
                    <p className="text-3xl font-bold text-blue-600">{todaysMood.mood_score}/10</p>
                    {yesterdaysMood && (
                      <p className={`text-xs mt-1 ${todaysMood.mood_score >= yesterdaysMood.mood_score ? 'text-green-500' : 'text-red-400'}`}>
                        {todaysMood.mood_score >= yesterdaysMood.mood_score ? '↑ Better' : '↓ Lower'} than yesterday
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <p className="text-3xl font-bold text-gray-300">—</p>
                    <p className="text-gray-400 text-xs mt-1">No check-in today yet</p>
                  </>
                )}
              </div>

              {/* Comparison Risk */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <p className="text-gray-500 text-sm mb-1">Comparison Risk</p>
                {latestScore ? (
                  <>
                    <p className={`text-3xl font-bold capitalize ${getRiskColor(latestScore.risk_level)}`}>
                      {latestScore.risk_level}
                    </p>
                    <p className="text-gray-400 text-xs mt-1">Score: {latestScore.comparison_index}/100</p>
                  </>
                ) : (
                  <>
                    <p className="text-3xl font-bold text-gray-300">—</p>
                    <p className="text-gray-400 text-xs mt-1">No data yet</p>
                  </>
                )}
              </div>

              {/* Total Check-ins */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <p className="text-gray-500 text-sm mb-1">Total Check-ins</p>
                <p className="text-3xl font-bold text-blue-600">{checkins.length}</p>
                <p className="text-gray-400 text-xs mt-1">Keep it up! 🎯</p>
              </div>

            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm mb-10">
              <h2 className="text-gray-800 font-bold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button onClick={() => navigate('/checkin')} className="bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl py-4 text-sm font-medium transition">📝 Log Mood</button>
                <button onClick={() => navigate('/insights')} className="bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl py-4 text-sm font-medium transition">📊 View Insights</button>
                <button onClick={() => navigate('/recommendations')} className="bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl py-4 text-sm font-medium transition">💡 Recommendations</button>
                <button onClick={() => navigate('/settings')} className="bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl py-4 text-sm font-medium transition">⚙️ Settings</button>
              </div>
            </div>

            {/* Recent Check-ins */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-gray-800 font-bold mb-4">Recent Check-ins</h2>
              {checkins.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-6">No check-ins yet. <span onClick={() => navigate('/checkin')} className="text-blue-600 cursor-pointer hover:underline">Log your first mood!</span></p>
              ) : (
                <div className="flex flex-col gap-3">
                  {checkins.slice(0, 5).map((item, index) => (
                    <div key={index} className="flex items-center justify-between border border-gray-100 rounded-xl px-4 py-3">
                      <div className="flex items-center gap-4">
                        <span className="text-2xl font-bold text-blue-600">{item.mood_score}</span>
                        <div>
                          <p className="text-gray-700 text-sm">{item.note || 'No note added'}</p>
                          <p className="text-gray-400 text-xs">{item.platform} · {getTimeAgo(item.created_at)}</p>
                        </div>
                      </div>
                      <span className={`text-xs font-medium capitalize px-2 py-1 rounded-full ${
                        item.sentiment_label === 'positive' ? 'bg-green-50 text-green-500' :
                        item.sentiment_label === 'negative' ? 'bg-red-50 text-red-400' :
                        'bg-gray-50 text-gray-400'
                      }`}>
                        {item.sentiment_label}
                      </span>
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