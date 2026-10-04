import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { FaPlus, FaTimes, FaSave, FaCamera, FaCheck } from 'react-icons/fa'

const SKILLS = [
  "Python","JavaScript","React","Node.js","Java","C++","C","HTML/CSS","PHP",
  "SQL","MongoDB","Data Structures","Algorithms","Machine Learning","Data Science",
  "Android Dev","Flutter","Photoshop","Figma","UI/UX Design","Video Editing",
  "Guitar","Piano","Singing","Spoken English","French","Digital Marketing","SEO",
  "Content Writing","Excel","PowerPoint","Tally","AutoCAD","Public Speaking","Interview Prep",
  "Git & GitHub","TypeScript","Next.js","Express","REST APIs","Cybersecurity","Cloud Computing",
  "Canva","Illustration","3D Modelling","Photography","Cooking","Fitness","Chess","Hindi",
  "Spanish","Japanese","Resume Review","Research","Project Management","Financial Literacy"
]

const AVATARS = [
  ...['Sky', 'Mango', 'River', 'Nova', 'Pixel', 'Orbit', 'Sage', 'Ember', 'Cedar', 'Lumen'].map(label => ({
    label, url: `https://api.dicebear.com/9.x/notionists/svg?seed=${label}`
  }))
]

const STREAM_DEGREE_MAP = {
  Arts: ['BA', 'BJMC', 'BFA', 'Bachelor of Social Work (BSW)', 'MA', 'Other'],
  Commerce: ['B.Com', 'BBA', 'BBM', 'M.Com', 'MBA', 'Other'],
  Medical: ['MBBS', 'BDS', 'BAMS', 'BHMS', 'BPT', 'Nursing', 'PharmD / B.Pharm', 'Other'],
  'Non-Medical': ['B.Tech / BE', 'BCA', 'BSc', 'B.Arch', 'Diploma in Engineering', 'Polytechnic Diploma', 'M.Tech / ME', 'MCA', 'MSc', 'Other'],
  Other: ['Certificate Course', 'Bootcamp', 'ITI / Trade Certificate', 'PG Diploma', 'Other']
}

const DEFAULT_STREAM = 'Non-Medical'
const STREAMS = Object.keys(STREAM_DEGREE_MAP)

const QUALIFICATIONS = [
  'B.Tech / BE', 'BCA', 'BSc', 'BBA', 'BA', 'B.Com', 'MBBS', 'B.Arch',
  'M.Tech / ME', 'MCA', 'MSc', 'MBA', 'MA', 'M.Com', 'PhD',
  'Diploma in Engineering', 'Polytechnic Diploma', 'PG Diploma', 'ITI / Trade Certificate',
  'Certificate Course', 'Bootcamp', 'Other'
]

const normalizeBranch = (value) => {
  const clean = String(value || '').trim()
  if (!clean) return ''
  if (clean.toLowerCase() === 'btech') return 'B.Tech / BE'
  return clean
}

const detectStreamForBranch = (branch) => {
  const normalized = normalizeBranch(branch)
  return STREAMS.find((stream) => STREAM_DEGREE_MAP[stream].includes(normalized)) || DEFAULT_STREAM
}

const Profile = () => {
  const { token, fetchUser } = useAuth()
  const [p, setP] = useState({
    name: '',
    bio: '',
    stream: DEFAULT_STREAM,
    branch: 'B.Tech / BE',
    year: 4,
    college: '',
    avatar: '',
    gender: 'prefer-not-to-say',
    education: [],
    socialLinks: {},
    canTeach: [],
    wantToLearn: []
  })
  const [newTeach, setNewTeach] = useState('')
  const [newLearn, setNewLearn] = useState('')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get('/api/users/me', { headers: { Authorization: `Bearer ${token}` } })
        const u = res.data.user
        const normalizedBranch = normalizeBranch(u.branch)
        const detectedStream = detectStreamForBranch(normalizedBranch)
        const streamDegrees = STREAM_DEGREE_MAP[detectedStream]
        const nextBranch = streamDegrees.includes(normalizedBranch) ? normalizedBranch : streamDegrees[0]
        setP({
          name: u.name || '',
          bio: u.bio || '',
          stream: detectedStream,
          branch: nextBranch,
          year: u.year || 4,
          college: u.college || '',
          avatar: u.avatar || AVATARS[0].url,
          gender: u.gender || 'prefer-not-to-say',
          education: u.education || [],
          socialLinks: u.socialLinks || {},
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

  const updateEducation = (index, key, value) => setP(current => ({
    ...current,
    education: current.education.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item)
  }))
  const addEducation = () => setP(current => ({ ...current, education: [...current.education, { qualification: '', institution: '', year: '' }] }))
  const removeEducation = (index) => setP(current => ({ ...current, education: current.education.filter((_, itemIndex) => itemIndex !== index) }))
  const streamOptions = STREAM_DEGREE_MAP[p.stream] || STREAM_DEGREE_MAP[DEFAULT_STREAM]
  const updateStream = (stream) => setP(current => ({
    ...current,
    stream,
    branch: (STREAM_DEGREE_MAP[stream] || [current.branch])[0]
  }))

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

  const chooseImage = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) return toast.error('Choose an image file')
    if (file.size > 350000) return toast.error('Please choose an image smaller than 350 KB')
    const reader = new FileReader()
    reader.onload = () => setP(current => ({ ...current, avatar: String(reader.result) }))
    reader.onerror = () => toast.error('Could not read that image')
    reader.readAsDataURL(file)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="profile-page pt-32 pb-16 container-x max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="profile-heading"><span className="eyebrow"><span className="live-dot" />YOUR IDENTITY CARD</span><h1>Edit <span className="accent-word">Profile</span></h1><p>Make it easy for the right person to understand what you bring and what you are ready to learn.</p></div>

        <div className="profile-identity-card glass-card">
          <div className="profile-identity-copy">
            <span className="profile-kicker">YOUR PHOTO, YOUR CALL</span>
            <h2>Choose how people meet you.</h2>
            <p>Use a photo that feels like you, or pick a friendly avatar when you would rather stay private.</p>
          </div>
          <div className="profile-avatar-preview">
            <img src={p.avatar || AVATARS[0].url} alt="Your profile preview" />
            <label className="avatar-upload-button" title="Upload profile image">
              <FaCamera aria-hidden="true" />
              <span>Upload</span>
              <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={event => chooseImage(event)} />
            </label>
          </div>
          <div className="avatar-picker">
            <div className="avatar-picker-heading"><span>Or choose an avatar</span><span>{AVATARS.length} options</span></div>
            <div className="avatar-options">
              {AVATARS.map(avatar => (
                <button type="button" key={avatar.label} className={`avatar-option ${p.avatar === avatar.url ? 'selected' : ''}`} onClick={() => setP(current => ({ ...current, avatar: avatar.url }))} aria-label={`Use ${avatar.label} avatar`}>
                  <img src={avatar.url} alt="" />
                  {p.avatar === avatar.url && <span><FaCheck aria-hidden="true" /></span>}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-card p-6 mb-6 profile-section-card">
          <h2 className="profile-section-title">The basics</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="profile-field-label">Name</label>
              <input type="text" value={p.name} onChange={e => setP({...p, name: e.target.value})} className="input-glass" />
            </div>
            <div>
              <label className="profile-field-label">How should your avatar feel?</label>
              <select value={p.gender} onChange={e => setP({...p, gender: e.target.value})} className="input-glass">
                <option value="prefer-not-to-say">Keep it open</option><option value="female">Feminine</option><option value="male">Masculine</option><option value="non-binary">Androgynous</option>
              </select>
            </div>
            <div>
              <label className="profile-field-label">College</label>
              <input type="text" value={p.college} onChange={e => setP({...p, college: e.target.value})} className="input-glass" />
            </div>

            <div>
              <label className="profile-field-label">Stream / field</label>
              <select value={p.stream} onChange={e => updateStream(e.target.value)} className="input-glass">
                {STREAMS.map(stream => <option key={stream} value={stream}>{stream}</option>)}
              </select>
            </div>
            <div>
              <label className="profile-field-label">Degree / diploma</label>
              <select value={p.branch} onChange={e => setP({...p, branch: e.target.value})} className="input-glass">
                {streamOptions.map(option => <option key={option} value={option}>{option}</option>)}
              </select>
            </div>
            <div>
              <label className="profile-field-label">Year</label>
              <select value={p.year} onChange={e => setP({...p, year: parseInt(e.target.value)})} className="input-glass">
                <option value={1}>1st Year</option>
                <option value={2}>2nd Year</option>
                <option value={3}>3rd Year</option>
                <option value={4}>4th Year</option>
              </select>
            </div>
          </div>
        </div>

          <div className="glass-card p-6 mb-6 profile-section-card">
            <div className="profile-section-heading-row"><div><h2 className="profile-section-title">Education timeline</h2><p className="profile-section-help">Add current and past study so matches understand your context.</p></div><button type="button" onClick={addEducation} className="btn-glow profile-add-button"><FaPlus /> Add education</button></div>
            <div className="space-y-4 mt-5">
              {p.education.map((item, index) => <motion.div layout className="education-row" key={`${index}-${item.qualification}`}>
                <select className="input-glass" value={item.qualification} onChange={e => updateEducation(index, 'qualification', e.target.value)}><option value="">Degree or diploma</option>{QUALIFICATIONS.map(option => <option key={option}>{option}</option>)}</select>
                <input className="input-glass" placeholder="Institution / university" value={item.institution} onChange={e => updateEducation(index, 'institution', e.target.value)} />
                <input className="input-glass" placeholder="Year or status (e.g. 2024–2028)" value={item.year} onChange={e => updateEducation(index, 'year', e.target.value)} />
                <button type="button" className="icon-button" onClick={() => removeEducation(index)} aria-label="Remove education"><FaTimes /></button>
              </motion.div>)}
              {p.education.length === 0 && <div className="profile-inline-note">No education entries yet. Add one to make your profile more useful.</div>}
            </div>
          </div>

          <div className="glass-card p-6 mb-6 profile-section-card">
            <h2 className="profile-section-title">Private ways to connect</h2>
            <p className="profile-section-help mb-4">These stay hidden from Explore and unlock only for an accepted exchange partner.</p>
            <div className="grid md:grid-cols-2 gap-x-4 gap-y-5">
              {['instagram', 'linkedin', 'github', 'website'].map(key => <div key={key} className="space-y-2"><label className="profile-field-label">{key[0].toUpperCase() + key.slice(1)}</label><input className="input-glass" placeholder={key === 'website' ? 'https://...' : '@handle or https://...'} value={p.socialLinks[key] || ''} onChange={e => setP(current => ({...current, socialLinks: {...current.socialLinks, [key]: e.target.value}}))} /></div>)}
            </div>
          </div>
          <div className="glass-card p-6 mb-6 profile-section-card">
            <h2 className="profile-section-title">Bio</h2>
            <label className="profile-field-label">Bio</label>
            <textarea value={p.bio} onChange={e => setP({...p, bio: e.target.value})} className="input-glass h-24 resize-none" maxLength={300} />
          </div>

        <div className="glass-card p-8 mb-6">
          <h2 className="profile-section-title"><span className="profile-section-icon profile-section-icon-teach">↗</span> Skills I can teach</h2>
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
          <h2 className="profile-section-title"><span className="profile-section-icon profile-section-icon-learn">↘</span> Skills I want to learn</h2>
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
