import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 flex flex-col items-center justify-center text-white px-6">
      
      {/* Logo & Title */}
      <div className="text-center mb-10">
        <div className="text-6xl mb-4">🧠</div>
        <h1 className="text-4xl font-bold mb-3">Digital Well-Being Analyzer</h1>
        <p className="text-blue-200 text-lg max-w-md mx-auto">
          Monitor how social media affects your mood and get personalized 
          recommendations for a healthier digital life.
        </p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-3xl w-full">
        <div className="bg-white/10 rounded-2xl p-6 text-center">
          <div className="text-3xl mb-3">📊</div>
          <h3 className="font-semibold mb-2">Track Your Mood</h3>
          <p className="text-blue-200 text-sm">Log how you feel after using social media</p>
        </div>
        <div className="bg-white/10 rounded-2xl p-6 text-center">
          <div className="text-3xl mb-3">🤖</div>
          <h3 className="font-semibold mb-2">AI Analysis</h3>
          <p className="text-blue-200 text-sm">Detect comparison triggers and risk levels</p>
        </div>
        <div className="bg-white/10 rounded-2xl p-6 text-center">
          <div className="text-3xl mb-3">💡</div>
          <h3 className="font-semibold mb-2">Get Insights</h3>
          <p className="text-blue-200 text-sm">Receive personalized recommendations</p>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => navigate('/register')}
          className="bg-blue-500 hover:bg-blue-400 text-white font-semibold px-8 py-3 rounded-full transition"
        >
          Get Started
        </button>
        <button
          onClick={() => navigate('/login')}
          className="bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3 rounded-full transition"
        >
          Login
        </button>
      </div>

    </div>
  )
}