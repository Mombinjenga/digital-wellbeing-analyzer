import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'

const categoryIcons: Record<string, string> = {
  detox: '🔕',
  mindfulness: '🧘',
  journaling: '📓',
  break: '☕',
  positive: '🌟',
  exercise: '🏃',
  social: '👥',
  sleep: '😴',
}

export default function Recommendations() {
  const navigate = useNavigate()
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await api.get('/insights/')
        setRecommendations(res.data.data || [])
      } catch (err) {
        console.error('Failed to fetch recommendations:', err)
      }
      setLoading(false)
    }
    fetchRecommendations()
  }, [])

  // Deduplicate by message so same tip doesn't repeat
  const unique = recommendations.filter(
    (rec, i, self) => i === self.findIndex(r => r.message === rec.message)
  )

  return (
    <div className="min-h-screen bg-blue-50">
      <nav className="bg-white shadow-sm px-10 py-4 flex justify-between items-center">
        <span className="text-blue-600 text-xl font-bold">WellBeing Analyzer</span>
        <button onClick={() => navigate('/dashboard')} className="text-gray-500 hover:text-blue-600 text-sm font-medium">← Back to Dashboard</button>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Recommendations</h1>
          <p className="text-gray-500 text-sm mt-1">Personalized tips based on your digital habits</p>
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-20">Loading your recommendations...</div>
        ) : unique.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
            <p className="text-4xl mb-4">📝</p>
            <p className="text-gray-700 font-medium mb-1">No recommendations yet</p>
            <p className="text-gray-400 text-sm mb-6">Complete a mood check-in to get personalized tips</p>
            <button
              onClick={() => navigate('/checkin')}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-500 transition"
            >
              Do a Check-in
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {unique.map((rec, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm p-6 flex items-start gap-4">
                <span className="text-3xl">{categoryIcons[rec.category?.toLowerCase()] || '💡'}</span>
                <div>
                  <span className="text-xs font-semibold uppercase text-blue-400 mb-1 block">{rec.category}</span>
                  <p className="text-gray-700 text-sm">{rec.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}