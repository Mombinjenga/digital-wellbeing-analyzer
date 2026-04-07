import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../utils/supabase'

export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    const handleCallback = async () => {
      const { data, error } = await supabase.auth.getSession()
      if (data.session) {
        navigate('/dashboard')
      } else {
        navigate('/login')
      }
    }
    handleCallback()
  }, [])

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-4">⏳</div>
        <p className="text-gray-600 font-medium">Verifying your account...</p>
        <p className="text-gray-400 text-sm mt-1">You'll be redirected shortly</p>
      </div>
    </div>
  )
}