import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { FaSearch } from 'react-icons/fa'

const SKILLS = [
  "Python", "JavaScript", "React", "Java", "C++", "Web Development",
  "Photoshop", "Guitar", "Spoken English", "Data Science", "UI/UX Design", "Video Editing"
]

const Explore = () => {
  const { token } = useAuth()
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [skill, setSkill] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const params = {}
      if (skill) params.skill = skill
      if (search) params.search = search
      const res = await axios.get('/api/users/explore', { params })
      setUsers(res.data.users || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [skill])

  const sendRequest = async (userId, mySkill, theirSkill) => {
    try {
      const res = await axios.post('/api/swaps', {
        receiverId: userId,
        senderTeaches: mySkill || 'Skill',
        receiverTeaches: theirSkill || 'Skill'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success(res.data.message)
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send swap request")
    }
  }

  return (
    <div className="pt-32 pb-16 container-x">
      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-black mb-8">
        Explore <span className="gradient-text">Students</span> 🔍
      </motion.h1>

      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && fetchUsers()}
            placeholder="Search by name..."
            className="input-glass pl-12"
          />
        </div>
        <button onClick={fetchUsers} className="btn-glow px-6">Search</button>
      </div>

      <div className="flex flex-wrap gap-2 mb-10">
        <button
          onClick={() => setSkill('')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${!skill ? 'bg-purple-600 text-white' : 'glass-card text-gray-400'}`}
        >
          All
        </button>
        {SKILLS.map(s => (
          <button
            key={s}
            onClick={() => setSkill(s)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${skill === s ? 'bg-purple-600 text-white' : 'glass-card text-gray-400'}`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : users.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <span className="text-5xl block mb-4">😕</span>
          <h3 className="text-xl font-bold">No students found</h3>
          <p className="text-gray-400 mt-2">Try a different search or filter!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((u, i) => (
            <motion.div
              key={u._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={u.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=default"}
                  alt=""
                  className="w-12 h-12 rounded-full border-2 border-purple-500/30"
                />
                <div>
                  <h3 className="font-bold">{u.name}</h3>
                  <p className="text-gray-500 text-xs">{u.branch} • Year {u.year}</p>
                </div>
              </div>

              {u.canTeach?.length > 0 && (
                <div className="mb-2">
                  <p className="text-xs text-gray-500 mb-1">Can Teach:</p>
                  <div className="flex flex-wrap gap-1">
                    {u.canTeach.map(s => (
                      <span key={s} className="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">{s}</span>
                    ))}
                  </div>
                </div>
              )}

              {u.wantToLearn?.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-1">Wants to Learn:</p>
                  <div className="flex flex-wrap gap-1">
                    {u.wantToLearn.map(s => (
                      <span key={s} className="text-xs px-2 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">{s}</span>
                    ))}
                  </div>
                </div>
              )}

              {token && (
                <button
                  onClick={() => sendRequest(u._id, u.wantToLearn?.[0], u.canTeach?.[0])}
                  className="w-full py-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500/20 transition text-sm font-medium"
                >
                  🤝 Send Swap Request
                </button>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Explore