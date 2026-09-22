import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const Register = () => {
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirm: '',
    branch: 'B.Tech', year: 4, college: '', acceptedTerms: false
  })
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirm) return toast.error("Passwords don't match!")
    if (form.password.length < 6) return toast.error("Password must be at least 6 characters!")
    if (!form.acceptedTerms) return toast.error('Please accept the Terms of Use and Privacy Notice.')
    setLoading(true)
    try {
      const data = await register({
        name: form.name,
        email: form.email,
        password: form.password,
        branch: form.branch,
        year: parseInt(form.year),
        college: form.college,
        acceptedTerms: form.acceptedTerms
      })
      toast.success(data.message)
      navigate('/profile')
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-24 pb-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-8 md:p-12 w-full max-w-lg"
      >
        <div className="text-center mb-8">
          <span className="text-4xl">🚀</span>
          <h2 className="text-3xl font-black mt-3">Join SkillBridge</h2>
          <p className="text-gray-400 mt-2">Start swapping skills today</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Name *</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Rahul" className="input-glass" required />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">College</label>
              <input type="text" name="college" value={form.college} onChange={handleChange} placeholder="XYZ College" className="input-glass" />
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Email *</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="rahul@college.edu" className="input-glass" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Password *</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="••••••••" className="input-glass" required minLength={6} />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Confirm *</label>
              <input type="password" name="confirm" value={form.confirm} onChange={handleChange} placeholder="••••••••" className="input-glass" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Branch</label>
              <select name="branch" value={form.branch} onChange={handleChange} className="input-glass">
              <option value="B.Tech">B.Tech</option>
              <option value="BCA">BCA</option>
                <option value="BBA">BBA</option>
                <option value="BSc">BSc</option>
                <option value="BTech">BTech</option>
                <option value="MCA">MCA</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Year</label>
              <select name="year" value={form.year} onChange={handleChange} className="input-glass">
                <option value={1}>1st Year</option>
                <option value={2}>2nd Year</option>
                <option value={3}>3rd Year</option>
                <option value={4}>4th Year</option>
              </select>
            </div>
          </div>
          <label className="consent-row">
            <input type="checkbox" name="acceptedTerms" checked={form.acceptedTerms} onChange={e => setForm({ ...form, acceptedTerms: e.target.checked })} />
            <span>I agree to the <Link to="/terms">Terms of Use</Link>, <Link to="/privacy">Privacy Notice</Link>, and <Link to="/community-guidelines">Community Guidelines</Link>.</span>
          </label>
          <button type="submit" disabled={loading} className="btn-glow w-full text-center py-4 mt-4">
            {loading ? "Creating..." : "Create Account 🎉"}
          </button>
        </form>
        <p className="text-center text-gray-500 mt-6 text-sm">
          Already have an account? <Link to="/login" className="text-purple-400 font-medium">Login</Link>
        </p>
      </motion.div>
    </div>
  )
}

export default Register
