import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const SKILLS = ['All', 'Python', 'JavaScript', 'React', 'Java', 'C++', 'Web Development', 'Photoshop', 'Guitar', 'Spoken English', 'Data Science', 'UI/UX Design', 'Video Editing']

const Explore = () => {
  const { token, user } = useAuth()
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedSkill, setSelectedSkill] = useState('All')

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get('/api/users')
        setStudents(res.data.users || res.data || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchStudents()
  }, [])

  const handleRequest = async (targetId) => {
    if (!token) return toast.error('Please login first!')
    try {
      await axios.post('/api/swaps/request', { recipientId: targetId }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success('Swap request sent!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send request')
    }
  }

  const filtered = selectedSkill === 'All'
    ? students
    : students.filter(s => s.canTeach?.includes(selectedSkill) || s.wantToLearn?.includes(selectedSkill))

  if (loading) {
    return <div className="page-wrapper" style={{ textAlign: 'center' }}>Loading Partners...</div>
  }

  return (
    <div className="page-wrapper">
      <h1 style={{ fontSize: '2.25rem', fontWeight: 900, marginBottom: '6px' }}>
        Explore <span className="gradient-text">Partners</span>
      </h1>
      <p style={{ color: '#94a3b8', fontSize: '1rem' }}>Find students to exchange skills with</p>

      {/* FILTER TAGS */}
      <div className="tags-row-container">
        {SKILLS.map((skill) => (
          <button
            key={skill}
            onClick={() => setSelectedSkill(skill)}
            className={selectedSkill === skill ? 'btn-glow' : 'btn-outline'}
            style={{ padding: '8px 16px', fontSize: '13px' }}
          >
            {skill}
          </button>
        ))}
      </div>

      {/* USER CARDS GRID */}
      <div className="cards-grid-container">
        {filtered.map((s) => (
          <div key={s._id} className="glass-card card-pad">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <img
                src={s.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
                alt=""
                style={{ width: 44, height: 44, borderRadius: '50%' }}
              />
              <div>
                <h3 style={{ fontWeight: 700 }}>{s.name}</h3>
                <p style={{ color: '#64748b', fontSize: '0.75rem' }}>{s.branch || 'Student'} • Year {s.year || '1'}</p>
              </div>
            </div>

            {user?._id !== s._id && (
              <button
                onClick={() => handleRequest(s._id)}
                className="btn-glow"
                style={{ width: '100%', padding: '10px' }}
              >
                🤝 Send Swap Request
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Explore