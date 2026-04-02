import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white flex flex-col">
      
      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-5 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-blue-600 text-2xl font-bold">WellBeing</span>
          <span className="text-gray-400 text-sm">Analyzer</span>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/login')}
            className="text-blue-600 font-medium hover:underline"
          >
            Login
          </button>
          <button
            onClick={() => navigate('/register')}
            className="bg-blue-600 text-white px-5 py-2 rounded-full font-medium hover:bg-blue-500 transition"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div className="flex flex-col items-center justify-center text-center px-6 py-24 bg-blue-50">
        <span className="bg-blue-100 text-blue-600 text-sm font-medium px-4 py-1 rounded-full mb-6">
          Your Digital Wellness Companion
        </span>
        <h1 className="text-5xl font-bold text-gray-800 mb-6 max-w-2xl leading-tight">
          Understand How Social Media Affects Your Mood
        </h1>
        <p className="text-gray-500 text-lg max-w-xl mb-10">
          Track your emotions, detect comparison triggers, and get personalized 
          recommendations for a healthier digital life.
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/register')}
            className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-500 transition text-lg"
          >
            Get Started Free
          </button>
          <button
            onClick={() => navigate('/login')}
            className="border border-blue-600 text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition text-lg"
          >
            Login
          </button>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-16 py-20">
        <div className="bg-blue-50 rounded-2xl p-8 text-center">
          <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-blue-600 text-2xl">📊</span>
          </div>
          <h3 className="text-gray-800 font-bold text-lg mb-2">Track Your Mood</h3>
          <p className="text-gray-500 text-sm">Log how you feel after using social media and spot patterns over time.</p>
        </div>
        <div className="bg-blue-50 rounded-2xl p-8 text-center">
          <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-blue-600 text-2xl">🤖</span>
          </div>
          <h3 className="text-gray-800 font-bold text-lg mb-2">AI Analysis</h3>
          <p className="text-gray-500 text-sm">Our AI detects comparison triggers and calculates your daily risk score.</p>
        </div>
        <div className="bg-blue-50 rounded-2xl p-8 text-center">
          <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-blue-600 text-2xl">💡</span>
          </div>
          <h3 className="text-gray-800 font-bold text-lg mb-2">Get Insights</h3>
          <p className="text-gray-500 text-sm">Receive personalized recommendations to improve your digital well-being.</p>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-gray-400 text-sm py-6 border-t">
        © 2025 Digital Well-Being Analyzer. All rights reserved.
      </footer>

    </div>
  )
}