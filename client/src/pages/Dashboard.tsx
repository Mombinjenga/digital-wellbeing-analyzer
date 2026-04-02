import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const navigate = useNavigate()

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

      {/* Content */}
      <div className="px-10 py-10">

        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Good morning! 👋</h1>
          <p className="text-gray-500 text-sm mt-1">Here's your digital well-being summary</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-gray-500 text-sm mb-1">Today's Mood</p>
            <p className="text-3xl font-bold text-blue-600">7/10</p>
            <p className="text-green-500 text-xs mt-1">↑ Better than yesterday</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-gray-500 text-sm mb-1">Comparison Risk</p>
            <p className="text-3xl font-bold text-orange-500">Moderate</p>
            <p className="text-gray-400 text-xs mt-1">Score: 45/100</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-gray-500 text-sm mb-1">Screen Time Today</p>
            <p className="text-3xl font-bold text-blue-600">2h 30m</p>
            <p className="text-red-400 text-xs mt-1">↑ 30m more than usual</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-10">
          <h2 className="text-gray-800 font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => navigate('/checkin')}
              className="bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl py-4 text-sm font-medium transition"
            >
              📝 Log Mood
            </button>
            <button
              onClick={() => navigate('/insights')}
              className="bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl py-4 text-sm font-medium transition"
            >
              📊 View Insights
            </button>
            <button
              onClick={() => navigate('/recommendations')}
              className="bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl py-4 text-sm font-medium transition"
            >
              💡 Recommendations
            </button>
            <button
              onClick={() => navigate('/settings')}
              className="bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl py-4 text-sm font-medium transition"
            >
              ⚙️ Settings
            </button>
          </div>
        </div>

        {/* Recent Check-ins */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-gray-800 font-bold mb-4">Recent Check-ins</h2>
          <div className="flex flex-col gap-3">
            {[
              { mood: 7, note: 'Feeling okay after browsing Instagram', platform: 'Instagram', time: '2 hours ago' },
              { mood: 4, note: 'Everyone looks happier than me on TikTok', platform: 'TikTok', time: 'Yesterday' },
              { mood: 8, note: 'Had a great day, minimal social media use', platform: 'Twitter', time: '2 days ago' },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between border border-gray-100 rounded-xl px-4 py-3">
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-blue-600">{item.mood}</span>
                  <div>
                    <p className="text-gray-700 text-sm">{item.note}</p>
                    <p className="text-gray-400 text-xs">{item.platform} · {item.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}