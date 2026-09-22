import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { FaPlus, FaTimes, FaSave } from 'react-icons/fa'

const SKILLS = [
  "Python","JavaScript","React","Node.js","Java","C++","C","HTML/CSS","PHP",
  "SQL","MongoDB","Data Structures","Algorithms","Machine Learning","Data Science",
  "Android Dev","Flutter","Photoshop","Figma","UI/UX Design","Video Editing",
  "Guitar","Piano","Singing","Spoken English","French","Digital Marketing","SEO",
  "Content Writing","Excel","PowerPoint","Tally","AutoCAD"
]

const Profile = () => {
  const { user, token, fetchUser } = useAuth()
  const [p, setP] = useState({ name: '', bio: '', branch: 'B.Tech', year: 4, college: '', canTeach: [], wantToLearn: [] })
  const [newTeach, setNewTeach] = useState('')
  const [newLearn, setNewLearn] = useState('')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get('/api/users/me', { headers: { Authorization: `Bearer ${token}` } })
        const u = res.data.user
        setP({
          name: u.name || '',
          bio: u.bio || '',
          branch: u.branch || 'B.Tech',
          year: u.year || 4,
          college: u.college || '',
          canTeach: u.canTeach || [],
          wantToLearn: u.wantToLearn || []
        })
      } catch {
        toast.error("Failed to load profile")
      } finally {
        setLoading(false)
      }
    }
    if (token) load()
    else setLoading(false)
  }, [token])

  const addSkill = (type, skill) => {
    if (!skill) return
    if (p[type].includes(skill)) return toast.error("Skill already added!")
    setP({ ...p, [type]: [...p[type], skill] })
    if (type === 'canTeach') setNewTeach('')
    else setNewLearn('')
  }

  const removeSkill = (type, skill) => {
    setP({ ...p, [type]: p[type].filter(s => s !== skill) })
  }

  const save = async () => {
    setSaving(true)
    try {
      await axios.put('/api/users/me', p, { headers: { Authorization: `Bearer ${token}` } })
      await fetchUser()
      toast.success("Profile saved! ✨")
    } catch {
      toast.error("Failed to save profile")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="pt-32 pb-16 container-x max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-black mb-8">Edit <span className="gradient-text">Profile</span> ✏️</h1>

        <div className="glass-card p-8 mb-6">
          <h2 className="text-xl font-bold mb-6">Basic Info</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Name</label>
              <input type="text" value={p.name} onChange={e => setP({...p, name: e.target.value})} className="input-glass" />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">College</label>
              <input type="text" value={p.college} onChange={e => setP({...p, college: e.target.value})} className="input-glass" />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Branch</label>
              <select value={p.branch} onChange={e => setP({...p, branch: e.target.value})} className="input-glass">
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
              <select value={p.year} onChange={e => setP({...p, year: parseInt(e.target.value)})} className="input-glass">
                <option value={1}>1st Year</option>
                <option value={2}>2nd Year</option>
                <option value={3}>3rd Year</option>
                <option value={4}>4th Year</option>
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label className="text-sm text-gray-400 mb-1 block">Bio</label>
            <textarea value={p.bio} onChange={e => setP({...p, bio: e.target.value})} className="input-glass h-24 resize-none" maxLength={300} />
          </div>
        </div>

        <div className="glass-card p-8 mb-6">
          <h2 className="text-xl font-bold mb-4 text-green-400">🎓 Skills I Can Teach</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {p.canTeach.map(s => (
              <span key={s} className="px-3 py-1 rounded-full text-sm bg-green-500/10 text-green-400 border border-green-500/20 flex items-center gap-2">
                {s} <FaTimes className="cursor-pointer hover:text-red-400 text-xs" onClick={() => removeSkill('canTeach', s)} />
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <select value={newTeach} onChange={e => setNewTeach(e.target.value)} className="input-glass flex-1">
              <option value="">Select skill...</option>
              {SKILLS.filter(s => !p.canTeach.includes(s)).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <button onClick={() => addSkill('canTeach', newTeach)} className="btn-glow px-4 flex items-center gap-2"><FaPlus /> Add</button>
          </div>
        </div>

        <div className="glass-card p-8 mb-6">
          <h2 className="text-xl font-bold mb-4 text-orange-400">📚 Skills I Want to Learn</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {p.wantToLearn.map(s => (
              <span key={s} className="px-3 py-1 rounded-full text-sm bg-orange-500/10 text-orange-400 border border-orange-500/20 flex items-center gap-2">
                {s} <FaTimes className="cursor-pointer hover:text-red-400 text-xs" onClick={() => removeSkill('wantToLearn', s)} />
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <select value={newLearn} onChange={e => setNewLearn(e.target.value)} className="input-glass flex-1">
              <option value="">Select skill...</option>
              {SKILLS.filter(s => !p.wantToLearn.includes(s)).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <button onClick={() => addSkill('wantToLearn', newLearn)} className="btn-glow px-4 flex items-center gap-2"><FaPlus /> Add</button>
          </div>
        </div>

        <button onClick={save} disabled={saving} className="btn-glow w-full py-4 text-lg flex items-center justify-center gap-2">
          <FaSave /> {saving ? "Saving..." : "Save Profile"}
        </button>
      </motion.div>
    </div>
  )
}

export default Profile
