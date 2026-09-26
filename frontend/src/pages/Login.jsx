import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = await login(email, password)
      toast.success(data.message)
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-shell min-h-screen flex items-center justify-center px-6 pt-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card auth-card p-8 md:p-12 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <span className="auth-sigil"><span className="brand-mark-bolt">↯</span></span>
          <h2 className="text-3xl font-black mt-3">Pick up your thread.</h2>
          <p className="text-gray-400 mt-2">Sign in to keep your exchanges moving.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="input-glass"
              required
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input-glass"
              required
            />
          </div>
          <button type="submit" disabled={loading} className="btn-glow w-full text-center py-4">
            {loading ? "Opening your space..." : "Enter SkillBridge →"}
          </button>
        </form>
        <p className="text-center text-gray-500 mt-6 text-sm">
          New to the exchange? <Link to="/register" className="auth-link font-medium">Create your profile</Link>
        </p>
      </motion.div>
    </div>
  )
}

export default Login