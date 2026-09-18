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
      <div className="page-wrapper" style={{ textAlign: 'center' }}>
        <p style={{ color: '#94a3b8', marginTop: '40px' }}>Loading Dashboard...</p>
      </div>
    )
  }

  const active = swaps.filter(s => s.status === 'accepted').length
  const pending = swaps.filter(s => s.status === 'pending').length
  const done = swaps.filter(s => s.status === 'completed').length

  return (
    <div className="page-wrapper">
      <div>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 900, marginBottom: '6px' }}>
          Welcome, <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👋
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1rem' }}>Your skill exchange overview</p>
      </div>

      {/* STATS CARDS */}
      <div className="stats-grid-container">
        <div className="glass-card card-pad">
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#4ade80' }}>{done}</div>
          <div style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '4px' }}>Completed Swaps</div>
        </div>
        <div className="glass-card card-pad">
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#60a5fa' }}>{active}</div>
          <div style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '4px' }}>Active Swaps</div>
        </div>
        <div className="glass-card card-pad">
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#facc15' }}>{pending}</div>
          <div style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '4px' }}>Pending Requests</div>
        </div>
        <div className="glass-card card-pad">
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#c084fc' }}>{matches.length}</div>
          <div style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '4px' }}>Skill Matches</div>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="buttons-row-container">
        <Link to="/profile" className="btn-glow">✏️ Edit Skills</Link>
        <Link to="/explore" className="btn-outline">🔍 Find Partners</Link>
        <Link to="/swaps" className="btn-outline">📋 My Swaps</Link>
      </div>

      {/* RECOMMENDED MATCHES */}
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>
          🎯 Recommended <span className="gradient-text">Matches</span>
        </h2>

        {matches.length === 0 ? (
          <div className="glass-card card-pad" style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔍</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>No matches yet</h3>
            <p style={{ color: '#94a3b8', marginBottom: '20px' }}>Add skills to your profile to find matches!</p>
            <Link to="/profile" className="btn-glow">Update Skills</Link>
          </div>
        ) : (
          <div className="cards-grid-container">
            {matches.slice(0, 6).map((m) => (
              <div key={m._id} className="glass-card card-pad">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <img
                    src={m.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
                    alt=""
                    style={{ width: 44, height: 44, borderRadius: '50%' }}
                  />
                  <div>
                    <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>{m.name}</h3>
                    <p style={{ color: '#64748b', fontSize: '0.75rem' }}>{m.branch} • Year {m.year}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard