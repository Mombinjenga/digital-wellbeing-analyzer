import { useNavigate } from 'react-router-dom'

export default function Insights() {
  const navigate = useNavigate()

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

        {/* Mood Trend */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-gray-800 font-bold mb-4">Weekly Mood Trend</h2>
          <div className="flex items-end gap-3 h-32">
            {[6, 4, 7, 5, 8, 3, 7].map((val, i) => (
              <div key={i} className="flex flex-col items-center flex-1">
                <div
                  className="bg-blue-400 rounded-t-lg w-full"
                  style={{ height: `${val * 10}%` }}
                />
                <span className="text-xs text-gray-400 mt-1">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Usage */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-gray-800 font-bold mb-4">Platform Usage This Week</h2>
          <div className="flex flex-col gap-3">
            {[
              { platform: 'Instagram', minutes: 120, color: 'bg-pink-400' },
              { platform: 'TikTok', minutes: 90, color: 'bg-blue-400' },
              { platform: 'Twitter', minutes: 45, color: 'bg-sky-400' },
              { platform: 'YouTube', minutes: 60, color: 'bg-red-400' },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{item.platform}</span>
                  <span className="text-gray-400">{item.minutes}m</span>
                </div>
                <div className="bg-gray-100 rounded-full h-2">
                  <div
                    className={`${item.color} h-2 rounded-full`}
                    style={{ width: `${(item.minutes / 120) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Risk History */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-gray-800 font-bold mb-4">Comparison Risk History</h2>
          <div className="flex flex-col gap-3">
            {[
              { date: 'Today', risk: 'moderate', score: 45 },
              { date: 'Yesterday', risk: 'high', score: 72 },
              { date: '2 days ago', risk: 'low', score: 20 },
              { date: '3 days ago', risk: 'moderate', score: 50 },
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center border border-gray-100 rounded-xl px-4 py-3">
                <span className="text-gray-600 text-sm">{item.date}</span>
                <div className="flex items-center gap-3">
                  <span className="text-gray-400 text-sm">{item.score}/100</span>
                  <span className={`text-xs font-semibold capitalize px-3 py-1 rounded-full ${
                    item.risk === 'high' ? 'bg-red-100 text-red-500' :
                    item.risk === 'moderate' ? 'bg-orange-100 text-orange-500' :
                    'bg-green-100 text-green-500'
                  }`}>{item.risk}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}