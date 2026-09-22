import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import {
  HiAdjustmentsHorizontal, HiArrowRight, HiCheckCircle, HiMagnifyingGlass,
  HiOutlineAcademicCap, HiOutlineChatBubbleBottomCenterText, HiOutlineXMark,
  HiSparkles
} from 'react-icons/hi2'
import { useAuth } from '../context/AuthContext'

const SKILLS = ['All', 'Python', 'JavaScript', 'React', 'Java', 'C++', 'Web Development', 'Data Science', 'UI/UX Design', 'Video Editing', 'Spoken English', 'Guitar']
const BRANCHES = ['All branches', 'B.Tech', 'BCA', 'BBA', 'BSc', 'MCA']
const avatarFor = (member) => member?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=skillbridge'

const Explore = () => {
  const { token, user } = useAuth()
  const navigate = useNavigate()
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedSkill, setSelectedSkill] = useState('All')
  const [branch, setBranch] = useState('All branches')
  const [query, setQuery] = useState('')
  const [selectedPartner, setSelectedPartner] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    const loadStudents = async () => {
      setLoading(true)
      setError('')
      try {
        const response = await axios.get('/api/users/explore', { params: branch === 'All branches' ? {} : { branch }, signal: controller.signal })
        setStudents(response.data.users || [])
      } catch (requestError) {
        if (requestError.name !== 'CanceledError') setError('Student profiles are unavailable right now. Please refresh and try again.')
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }
    loadStudents()
    return () => controller.abort()
  }, [branch])

  const visibleStudents = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    const identity = String(user?._id || user?.id || '')
    return students.filter((student) => {
      if (String(student._id) === identity) return false
      const skills = [...(student.canTeach || []), ...(student.wantToLearn || [])]
      const matchesSkill = selectedSkill === 'All' || skills.some((skill) => skill.toLowerCase() === selectedSkill.toLowerCase())
      const searchable = `${student.name || ''} ${student.college || ''} ${student.branch || ''} ${skills.join(' ')}`.toLowerCase()
      return matchesSkill && (!normalizedQuery || searchable.includes(normalizedQuery))
    })
  }, [students, selectedSkill, query, user])

  const startRequest = (partner) => {
    if (!token) { toast('Sign in to propose a skill exchange.'); navigate('/login'); return }
    if (!user?.canTeach?.length || !user?.wantToLearn?.length) { toast.error('Add both teaching and learning skills before sending a request.'); navigate('/profile'); return }
    if (!partner.canTeach?.length) { toast.error('This student has not added teaching skills yet.'); return }
    setSelectedPartner(partner)
  }

  return (
    <section className="product-page explore-page container-x">
      <header className="product-hero explore-hero">
        <div><span className="eyebrow"><HiSparkles /> DISCOVER YOUR NEXT EXCHANGE</span><h1>Learn from people who <span>get it.</span></h1><p>Explore your campus community, find a practical fit, and propose a clear two-way learning session.</p></div>
        <div className="explore-hero-stat"><strong>{loading ? '—' : visibleStudents.length}</strong><span>potential partners</span></div>
      </header>

      <section className="discovery-toolbar" aria-label="Search student profiles">
        <label className="search-field"><HiMagnifyingGlass aria-hidden="true" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name, college, or skill" aria-label="Search students" /></label>
        <label className="select-field"><HiAdjustmentsHorizontal aria-hidden="true" /><span className="sr-only">Filter by program</span><select value={branch} onChange={(event) => setBranch(event.target.value)}>{BRANCHES.map((item) => <option value={item} key={item}>{item}</option>)}</select></label>
      </section>

      <div className="filter-row" role="group" aria-label="Filter by skill">
        {SKILLS.map((skill) => <button className={selectedSkill === skill ? 'filter-chip active' : 'filter-chip'} key={skill} onClick={() => setSelectedSkill(skill)}>{skill}</button>)}
      </div>

      <div className="results-summary" aria-live="polite"><span>{loading ? 'Finding students…' : `${visibleStudents.length} ${visibleStudents.length === 1 ? 'student' : 'students'} found`}</span>{selectedSkill !== 'All' && <button onClick={() => setSelectedSkill('All')}>Clear skill filter <HiOutlineXMark /></button>}</div>

      {error ? <div className="empty-state"><div className="empty-icon"><HiOutlineAcademicCap /></div><h2>We could not load the community.</h2><p>{error}</p><button className="button button-primary" onClick={() => window.location.reload()}>Try again</button></div> :
        loading ? <div className="partner-grid"><PartnerSkeleton /><PartnerSkeleton /><PartnerSkeleton /></div> :
          visibleStudents.length === 0 ? <div className="empty-state"><div className="empty-icon"><HiMagnifyingGlass /></div><h2>No match for those filters.</h2><p>Try a different skill or broaden your programme filter.</p><button className="button button-secondary" onClick={() => { setSelectedSkill('All'); setBranch('All branches'); setQuery('') }}>Reset filters</button></div> :
            <div className="partner-grid">{visibleStudents.map((student) => <PartnerCard key={student._id} student={student} currentUser={user} onRequest={() => startRequest(student)} />)}</div>}

      {selectedPartner && <SwapRequestDialog partner={selectedPartner} currentUser={user} token={token} onClose={() => setSelectedPartner(null)} />}
    </section>
  )
}

const PartnerCard = ({ student, currentUser, onRequest }) => {
  const learningMatches = student.canTeach?.filter((skill) => currentUser?.wantToLearn?.includes(skill)) || []
  const mutualSkills = student.wantToLearn?.filter((skill) => currentUser?.canTeach?.includes(skill)) || []
  const isMutual = mutualSkills.length > 0 && learningMatches.length > 0
  return (
    <article className="partner-card">
      <div className="partner-topline"><img className="member-avatar member-avatar-large" src={avatarFor(student)} alt={`${student.name}'s avatar`} /><span className={isMutual ? 'match-badge mutual' : 'match-badge'}>{isMutual ? 'Mutual exchange' : 'Available to teach'}</span></div>
      <div className="partner-heading"><h2>{student.name}</h2><p>{student.branch || 'Student'} · Year {student.year || '—'}</p>{student.college && <span>{student.college}</span>}</div>
      {student.bio && <p className="partner-bio">{student.bio}</p>}
      <div className="partner-skills"><p><span>Can teach</span></p><div>{(student.canTeach || []).slice(0, 4).map((skill) => <span className={learningMatches.includes(skill) ? 'skill-chip skill-chip-learn highlighted' : 'skill-chip skill-chip-learn'} key={skill}>{skill}</span>)}{student.canTeach?.length > 4 && <span className="skill-more">+{student.canTeach.length - 4}</span>}</div></div>
      <div className="partner-skills partner-skills-secondary"><p><span>Wants to learn</span></p><div>{(student.wantToLearn || []).slice(0, 3).map((skill) => <span className={mutualSkills.includes(skill) ? 'skill-chip skill-chip-teach highlighted' : 'skill-chip skill-chip-teach'} key={skill}>{skill}</span>)}</div></div>
      <button className="button button-primary partner-action" onClick={onRequest}>Propose an exchange <HiArrowRight /></button>
    </article>
  )
}

const SwapRequestDialog = ({ partner, currentUser, token, onClose }) => {
  const initialOffer = currentUser?.canTeach?.[0] || ''
  const initialRequest = partner?.canTeach?.find((skill) => currentUser?.wantToLearn?.includes(skill)) || partner?.canTeach?.[0] || ''
  const [offer, setOffer] = useState(initialOffer)
  const [request, setRequest] = useState(initialRequest)
  const [message, setMessage] = useState(`Hi ${partner.name?.split(' ')[0] || ''}, I’d like to plan a focused skill exchange with you.`)
  const [submitting, setSubmitting] = useState(false)
  const submit = async (event) => {
    event.preventDefault()
    if (!offer || !request) { toast.error('Choose the two skills for this exchange.'); return }
    setSubmitting(true)
    try {
      await axios.post('/api/swaps', { receiverId: partner._id, senderTeaches: offer, receiverTeaches: request, message }, { headers: { Authorization: `Bearer ${token}` } })
      toast.success(`Exchange proposal sent to ${partner.name}.`)
      onClose()
    } catch (requestError) {
      toast.error(requestError.response?.data?.message || 'We could not send that proposal.')
    } finally { setSubmitting(false) }
  }
  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="exchange-dialog" role="dialog" aria-modal="true" aria-labelledby="exchange-title" onMouseDown={(event) => event.stopPropagation()}>
        <button className="dialog-close" onClick={onClose} aria-label="Close exchange proposal"><HiOutlineXMark /></button>
        <div className="dialog-heading"><span className="eyebrow">NEW EXCHANGE</span><h2 id="exchange-title">Propose a session with {partner.name?.split(' ')[0]}.</h2><p>Be specific about what each person will share. Clear sessions build better peer learning.</p></div>
        <form onSubmit={submit}>
          <div className="exchange-plan"><label><span>I can teach</span><select value={offer} onChange={(event) => setOffer(event.target.value)}>{currentUser?.canTeach?.map((skill) => <option value={skill} key={skill}>{skill}</option>)}</select></label><div className="exchange-arrow">↔</div><label><span>I want to learn</span><select value={request} onChange={(event) => setRequest(event.target.value)}>{partner.canTeach?.map((skill) => <option value={skill} key={skill}>{skill}</option>)}</select></label></div>
          <label className="message-field"><span><HiOutlineChatBubbleBottomCenterText /> Add a short note</span><textarea value={message} onChange={(event) => setMessage(event.target.value)} maxLength={280} rows="4" /><small>{message.length}/280</small></label>
          <div className="dialog-note"><HiCheckCircle /> No money involved. Agree on time, place, and scope before you meet.</div>
          <div className="dialog-actions"><button type="button" className="button button-secondary" onClick={onClose}>Cancel</button><button className="button button-primary" disabled={submitting}>{submitting ? 'Sending…' : 'Send proposal'} <HiArrowRight /></button></div>
        </form>
      </section>
    </div>
  )
}

const PartnerSkeleton = () => <div className="partner-card partner-skeleton" aria-label="Loading student profile"><span /><span /><span /><span /></div>

export default Explore
