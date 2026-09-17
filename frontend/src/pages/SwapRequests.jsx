import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { FaCheck, FaTimes, FaClock, FaCheckCircle } from 'react-icons/fa'

const SwapRequests = () => {
  const { user, token } = useAuth()
  const [swaps, setSwaps] = useState([])
  const [tab, setTab] = useState('all')
  const [loading, setLoading] = useState(true)

  const fetchSwaps = async () => {
    try {
      const res = await axios.get('/api/swaps', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setSwaps(res.data.swaps || [])
    } catch (err) {
      toast.error("Failed to load swaps")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      fetchSwaps()
    }
  }, [token])

  const updateStatus = async (swapId, status) => {
    try {
      await axios.put(`/api/swaps/${swapId}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success(`Swap ${status}! ✅`)
      fetchSwaps()
    } catch (err) {
      toast.error("Failed to update swap")
    }
  }

  const filteredSwaps = tab === 'all' ? swaps : swaps.filter(s => s.status === tab)

  const statusColors = {
    pending: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
    accepted: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
    rejected: 'text-red-400 bg-red-400/10 border-red-400/30',
    completed: 'text-green-400 bg-green-400/10 border-green-400/30'
  }

  const statusIcons = {
    pending: <FaClock />,
    accepted: <FaCheck />,
    rejected: <FaTimes />,
    completed: <FaCheckCircle />
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="pt-28 pb-12 px-6 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-black mb-8">
          My <span className="gradient-text">Swaps</span> 🔄
        </h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {['all', 'pending', 'accepted', 'completed', 'rejected'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-full text-sm font-medium capitalize whitespace-nowrap transition-all ${
                tab === t
                  ? 'bg-purple-600 text-white'
                  : 'glass-card text-gray-400 hover:text-white'
              }`}
            >
              {t} {t !== 'all' && `(${swaps.filter(s => s.status === t).length})`}
            </button>
          ))}
        </div>

        {/* Swap List */}
        {filteredSwaps.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <span className="text-5xl block mb-4">📭</span>
            <h3 className="text-xl font-bold mb-2">No swap requests</h3>
            <p className="text-gray-400">
              Explore students and send your first swap request!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSwaps.map((swap, i) => {
              const isSender = swap.sender?._id === user?.id
              const otherPerson = isSender ? swap.receiver : swap.sender

              return (
                <motion.div
                  key={swap._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card p-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <img
                        src={otherPerson?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=default"}
                        alt=""
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <h3 className="font-bold">{otherPerson?.name || "Student"}</h3>
                        <p className="text-gray-400 text-sm">
                          {isSender ? 'You teach' : 'They teach'}{' '}
                          <span className="text-green-400 font-medium">{swap.senderTeaches}</span>
                          {' ↔ '}
                          {isSender ? 'They teach' : 'You teach'}{' '}
                          <span className="text-blue-400 font-medium">{swap.receiverTeaches}</span>
                        </p>
                      </div>
                    </div>

                    <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${statusColors[swap.status]}`}>
                      {statusIcons[swap.status]} {swap.status}
                    </span>
                  </div>

                  {/* Message */}
                  {swap.message && (
                    <p className="text-gray-500 text-sm mt-3 italic">"{swap.message}"</p>
                  )}

                  {/* Actions */}
                  {swap.status === 'pending' && !isSender && (
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => updateStatus(swap._id, 'accepted')}
                        className="px-4 py-2 rounded-lg bg-green-500/20 text-green-400
                          border border-green-500/30 hover:bg-green-500/30 transition-all text-sm"
                      >
                        ✅ Accept
                      </button>
                      <button
                        onClick={() => updateStatus(swap._id, 'rejected')}
                        className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400
                          border border-red-500/30 hover:bg-red-500/30 transition-all text-sm"
                      >
                        ❌ Reject
                      </button>
                    </div>
                  )}

                  {swap.status === 'accepted' && (
                    <button
                      onClick={() => updateStatus(swap._id, 'completed')}
                      className="mt-4 px-4 py-2 rounded-lg bg-purple-500/20 text-purple-400
                        border border-purple-500/30 hover:bg-purple-500/30 transition-all text-sm"
                    >
                      ✅ Mark as Completed
                    </button>
                  )}

                  <p className="text-gray-600 text-xs mt-3">
                    {new Date(swap.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </p>
                </motion.div>
              )
            })}
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default SwapRequests