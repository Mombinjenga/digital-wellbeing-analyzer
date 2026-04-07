import { Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import CheckIn from './pages/CheckIn'
import Insights from './pages/Insights'
import Recommendations from './pages/Recommendations'
import Settings from './pages/Settings'
import AuthCallback from './pages/AuthCallback'
import ResetPassword from './pages/ResetPassword'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/checkin" element={<CheckIn />} />
      <Route path="/insights" element={<Insights />} />
      <Route path="/recommendations" element={<Recommendations />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default App