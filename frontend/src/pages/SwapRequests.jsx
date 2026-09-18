import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const SwapRequests = () => {
  const { token } = useAuth()
  const [swaps, setSwaps] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchSwaps = async () => {
    try {
      const res = await axios.get('/api/swaps', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setSwaps(res.data.swaps || res.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) fetchSwaps()
  }, [token])

  const handleAction = async (id, action) => {
    try {
      await axios.put(`/api/swaps/${id}/${action}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success(`Request ${action}ed!`)
      fetchSwaps()
    } catch (err) {
      toast.error('Failed to update request')
    }
  }

  if (loading) {
    return <div className="container-x" style={{ padding: '40px 28px' }}>Loading...</div>
  }

  return (
    <div className="container-x" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
      <h1 style={{ fontSize: '2.25rem', fontWeight: 900, marginBottom: '8px' }}>
        My <span className="gradient-text">Swap Requests</span>
      </h1>
      <p style={{ color: '#94a3b8', marginBottom: '28px' }}>Manage your incoming and outgoing requests</p>

      {swaps.length === 0 ? (
        <div className="glass-card card-pad" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>📬</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>No swap requests</h3>
          <p style={{ color: '#94a3b8' }}>Explore students and send your first swap request!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {swaps.map((s) => (
            <div key={s._id} className="glass-card card-pad">
              <p style={{ fontWeight: 700, marginBottom: '10px' }}>{s.status?.toUpperCase()}</p>
              <p style={{ color: '#94a3b8', marginBottom: '14px' }}>
                {s.requester?.name || 'Student'} requested a swap
              </p>
              {s.status === 'pending' && (
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => handleAction(s._id, 'accept')} className="btn-glow" style={{ padding: '8px 16px' }}>
                    Accept
                  </button>
                  <button onClick={() => handleAction(s._id, 'reject')} className="btn-outline" style={{ padding: '8px 16px' }}>
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SwapRequests