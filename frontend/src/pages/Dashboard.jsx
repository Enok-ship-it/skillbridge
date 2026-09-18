import { Link } from 'react-router-dom'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

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
      <div className="container-x" style={{ padding: '40px 28px', textAlign: 'center' }}>
        Loading...
      </div>
    )
  }

  const active = swaps.filter(s => s.status === 'accepted').length
  const pending = swaps.filter(s => s.status === 'pending').length
  const done = swaps.filter(s => s.status === 'completed').length

  return (
    <div className="container-x" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
      <h1 style={{ fontSize: '2.25rem', fontWeight: 900, marginBottom: '8px' }}>
        Welcome, <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👋
      </h1>
      <p style={{ color: '#94a3b8', marginBottom: '32px' }}>Your skill exchange overview</p>

      {/* STATS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '16px', marginBottom: '28px' }}>
        {[
          { label: 'Completed Swaps', value: done, color: '#4ade80' },
          { label: 'Active Swaps', value: active, color: '#60a5fa' },
          { label: 'Pending Requests', value: pending, color: '#facc15' },
          { label: 'Skill Matches', value: matches.length, color: '#c084fc' }
        ].map((s, i) => (
          <div key={i} className="glass-card card-pad">
            <div style={{ fontSize: '1.875rem', fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '4px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* BUTTONS */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '40px' }}>
        <Link to="/profile" className="btn-glow">✏️ Edit Skills</Link>
        <Link to="/explore" className="btn-outline">🔍 Find Partners</Link>
        <Link to="/swaps" className="btn-outline">📋 My Swaps</Link>
      </div>

      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '20px' }}>
        🎯 Recommended <span className="gradient-text">Matches</span>
      </h2>

      {matches.length === 0 ? (
        <div className="glass-card card-pad" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔍</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>No matches yet</h3>
          <p style={{ color: '#94a3b8', marginBottom: '20px' }}>Add skills to your profile to find matches!</p>
          <Link to="/profile" className="btn-glow">Update Skills</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '24px' }}>
          {matches.slice(0, 6).map((m) => (
            <div key={m._id} className="glass-card card-pad">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img
                  src={m.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
                  alt=""
                  style={{ width: 48, height: 48, borderRadius: '50%' }}
                />
                <div>
                  <h3 style={{ fontWeight: 700 }}>{m.name}</h3>
                  <p style={{ color: '#64748b', fontSize: 12 }}>{m.branch} • Year {m.year}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Dashboard