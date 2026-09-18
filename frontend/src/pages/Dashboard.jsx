import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const Dashboard = () => {
  const { user, token } = useAuth()
  const [matches, setMatches] = useState([])
  const [swaps, setSwaps] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const h = { headers: { Authorization: `Bearer ${token}` } }
        const [m, s] = await Promise.all([
          axios.get('/api/users/matches', h),
          axios.get('/api/swaps', h)
        ])
        setMatches(m.data.matches || [])
        setSwaps(s.data.swaps || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    if (token) fetchData()
    else setLoading(false)
  }, [token])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  const active = swaps.filter(s => s.status === 'accepted').length
  const pending = swaps.filter(s => s.status === 'pending').length
  const done = swaps.filter(s => s.status === 'completed').length

  return (
    <div className="pt-32 pb-16 container-x">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-black mb-2">
          Welcome, <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👋
        </h1>
        <p className="text-gray-400 mb-10">Your skill exchange overview</p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Completed Swaps", value: done, color: "text-green-400" },
          { label: "Active Swaps", value: active, color: "text-blue-400" },
          { label: "Pending Requests", value: pending, color: "text-yellow-400" },
          { label: "Skill Matches", value: matches.length, color: "text-purple-400" }
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="glass-card p-5">
            <div className={`text-3xl font-black ${s.color}`}>{s.value}</div>
            <div className="text-gray-500 text-sm mt-1">{s.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-wrap gap-4 mb-10">
        <Link to="/profile" className="btn-glow">✏️ Edit Skills</Link>
        <Link to="/explore" className="px-6 py-3 rounded-xl border border-white/20 text-gray-300 hover:bg-white/5 transition">🔍 Find Partners</Link>
        <Link to="/swaps" className="px-6 py-3 rounded-xl border border-white/20 text-gray-300 hover:bg-white/5 transition">📋 My Swaps</Link>
      </div>

      <h2 className="text-2xl font-bold mb-6">🎯 Recommended <span className="gradient-text">Matches</span></h2>
      {matches.length === 0 ? (
        <div className="glass-card p-10 text-center">
          <span className="text-5xl block mb-4">🔍</span>
          <h3 className="text-xl font-bold mb-2">No matches yet</h3>
          <p className="text-gray-400 mb-4">Add skills to your profile to find matches!</p>
          <Link to="/profile" className="btn-glow">Update Skills</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.slice(0, 6).map((m, i) => (
            <motion.div key={m._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="glass-card p-6">
              <div className="flex items-center gap-3 mb-3">
                <img src={m.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=default"} alt="" className="w-12 h-12 rounded-full border-2 border-purple-500/30" />
                <div>
                  <h3 className="font-bold">{m.name}</h3>
                  <p className="text-gray-500 text-xs">{m.branch} • Year {m.year}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1 mb-2">
                {m.canTeach?.slice(0, 3).map(s => <span key={s} className="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">{s}</span>)}
              </div>
              <div className="flex flex-wrap gap-1">
                {m.wantToLearn?.slice(0, 3).map(s => <span key={s} className="text-xs px-2 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">{s}</span>)}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Dashboard