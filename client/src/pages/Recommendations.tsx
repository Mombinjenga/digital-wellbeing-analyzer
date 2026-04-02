import { useNavigate } from 'react-router-dom'

export default function Recommendations() {
  const navigate = useNavigate()

  const recommendations = [
    { category: 'detox', message: 'Consider a 24-hour social media detox to reset your mindset.', icon: '🔕' },
    { category: 'mindfulness', message: 'Try a 10-minute meditation to ground yourself in the present.', icon: '🧘' },
    { category: 'journaling', message: 'Write down 3 things you are grateful for about yourself today.', icon: '📓' },
    { category: 'break', message: 'Take a break from social media for the rest of the day.', icon: '☕' },
    { category: 'positive', message: 'Great job maintaining a healthy digital balance today!', icon: '🌟' },
  ]

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

        <div className="flex flex-col gap-4">
          {recommendations.map((rec, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm p-6 flex items-start gap-4">
              <span className="text-3xl">{rec.icon}</span>
              <div>
                <span className="text-xs font-semibold uppercase text-blue-400 mb-1 block">{rec.category}</span>
                <p className="text-gray-700 text-sm">{rec.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}