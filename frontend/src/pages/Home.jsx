import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { motion } from 'framer-motion'
import {
  HiArrowUpRight,
  HiCheck,
  HiMagnifyingGlass,
  HiOutlineArrowPath,
  HiOutlineBolt,
  HiOutlineChatBubbleLeftRight,
  HiOutlineSparkles,
} from 'react-icons/hi2'
import { useAuth } from '../context/AuthContext'

const PROCESS = [
  { number: '01', title: 'Put your skills on the table', copy: 'Tell the community what you can teach and what you want to get better at.' },
  { number: '02', title: 'Find a useful overlap', copy: 'Browse real student profiles and spot the person whose goals make sense with yours.' },
  { number: '03', title: 'Make a simple swap', copy: 'Send a focused proposal, agree on the details, and learn together — no money involved.' },
]

const FAQS = [
  ['Is SkillBridge free?', 'Yes. SkillBridge is built around a simple exchange of time and knowledge, not subscriptions or paywalls.'],
  ['Do I need to be an expert?', 'No. You only need to be a little further along than the person you are helping. Peer learning works because the experience is fresh.'],
  ['How do I keep an exchange focused?', 'Each proposal has one skill to teach, one skill to learn, and a short note. Agree on the time and scope before you meet.'],
]

const avatarFor = (student) => student?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(student?.name || 'Student')}`

const Home = () => {
  const { user } = useAuth()
  const [students, setStudents] = useState([])
  const [query, setQuery] = useState('')
  const [openFaq, setOpenFaq] = useState(0)
  const [loading, setLoading] = useState(true)
  const [communityError, setCommunityError] = useState('')

  const loadCommunity = () => {
    const controller = new AbortController()
    setLoading(true)
    setCommunityError('')
    axios.get('/api/users/explore', { signal: controller.signal })
      .then(({ data }) => setStudents(data.users || []))
      .catch((error) => {
        if (error.name !== 'CanceledError') {
          setStudents([])
          setCommunityError('The live directory is offline right now. Start the backend and try again.')
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }

  useEffect(() => loadCommunity(), [])

  const skills = useMemo(() => {
    const counts = new Map()
    students.forEach((student) => [...(student.canTeach || []), ...(student.wantToLearn || [])].forEach((skill) => {
      counts.set(skill, (counts.get(skill) || 0) + 1)
    }))
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([skill]) => skill)
  }, [students])

  const visibleStudents = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return students.slice(0, 3)
    return students.filter((student) => `${student.name} ${student.branch} ${student.college} ${(student.canTeach || []).join(' ')} ${(student.wantToLearn || []).join(' ')}`.toLowerCase().includes(normalized)).slice(0, 3)
  }, [students, query])

  return (
    <div className="home-new">
      <section className="home-hero">
        <div className="container-x home-hero-grid">
          <div className="home-hero-copy">
            <motion.p className="eyebrow home-kicker" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <span className="live-dot" /> A student-powered skill exchange
            </motion.p>
            <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
              Your next <em>breakthrough</em> is probably sitting in the next classroom.
            </motion.h1>
            <motion.p className="home-hero-lede" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}>
              SkillBridge turns “I can teach that” into a real conversation. Trade practical skills with people who understand your campus, your deadlines, and your starting point.
            </motion.p>
            <motion.div className="home-hero-actions" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }}>
              <Link to={user ? '/explore' : '/register'} className="button button-primary">Find your exchange <HiArrowUpRight /></Link>
              <Link to="/explore" className="button button-secondary">See the community</Link>
            </motion.div>
            <div className="home-proofline"><HiCheck /> Free to use <span /> <HiCheck /> Built for peer learning <span /> <HiCheck /> No awkward pitching</div>
          </div>

          <motion.div className="home-hero-visual" initial={{ opacity: 0, scale: 0.94, rotate: 2 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ delay: 0.18, duration: 0.7 }}>
            <div className="hero-note hero-note-back" />
            <div className="hero-note">
              <div className="note-topline"><span>LIVE COMMUNITY</span><HiOutlineSparkles /></div>
              <div className="note-rule" />
              <p className="note-question">What are you<br /><strong>curious about?</strong></p>
              <div className="note-search"><HiMagnifyingGlass /><span>{skills[0] || 'Search a skill'}</span><kbd>⌘ K</kbd></div>
              <div className="note-cloud">
                {(skills.length ? skills : ['React', 'Photography', 'Excel', 'Spoken English']).slice(0, 4).map((skill, index) => <span key={skill} className={`note-pill note-pill-${index}`}>{skill}</span>)}
              </div>
              <div className="note-footer"><span className="avatar-stack"><i /><i /><i /></span><span>{loading ? 'Finding your campus…' : `${students.length || 'New'} students in the exchange`}</span></div>
            </div>
            <div className="hero-stamp"><HiOutlineBolt /><span>LEARN<br />OUT LOUD</span></div>
          </motion.div>
        </div>
        <div className="home-scroll-cue"><span>Scroll to explore</span><i /></div>
      </section>

      <section className="home-live-section">
        <div className="container-x">
          <div className="section-intro-row">
            <div><p className="eyebrow">01 / The community</p><h2>People, not profiles.</h2></div>
            <p>Start with a person who has a useful skill, a specific goal, and a reason to show up.</p>
          </div>
          <div className="live-board">
            <div className="live-board-header"><div><span className="live-dot" /> Live student directory</div><Link to="/explore">Open full directory <HiArrowUpRight /></Link></div>
            <label className="live-search"><HiMagnifyingGlass /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search a name, programme, or skill" aria-label="Search the student community" /></label>
            <div className="live-students">
              {communityError ? <div className="live-empty live-empty-error"><HiOutlineArrowPath /><span>{communityError}</span><button type="button" onClick={loadCommunity}>Retry</button></div> : visibleStudents.length ? visibleStudents.map((student) => (
                <Link to="/explore" className="live-student" key={student._id}>
                  <img src={avatarFor(student)} alt="" />
                  <div><strong>{student.name}</strong><span>{student.branch || 'Student'} {student.college ? `· ${student.college}` : ''}</span></div>
                  <div className="student-skill">{student.canTeach?.[0] || 'Ready to connect'} <HiArrowUpRight /></div>
                </Link>
              )) : <div className="live-empty"><HiOutlineArrowPath /> {loading ? 'Loading the latest student profiles…' : query ? `No student matches “${query}”. Try a broader search.` : 'The directory is warming up. Be the first profile people find.'}</div>}
            </div>
          </div>
        </div>
      </section>

      <section className="home-process-section">
        <div className="container-x">
          <div className="section-intro-row process-intro"><div><p className="eyebrow">02 / Keep it human</p><h2>A smaller loop<br /><em>works better.</em></h2></div><p>No endless feeds. No course catalogue. Just a clear path from “I want to learn” to “let’s try it together.”</p></div>
          <div className="process-grid">{PROCESS.map((item) => <motion.article key={item.number} className="process-card" whileHover={{ y: -8 }}><span>{item.number}</span><h3>{item.title}</h3><p>{item.copy}</p><HiArrowUpRight /></motion.article>)}</div>
        </div>
      </section>

      <section className="home-faq-section">
        <div className="container-x faq-layout">
          <div><p className="eyebrow">03 / Good questions</p><h2>Make the first<br /><em>move easy.</em></h2><p className="faq-aside-copy">The best exchanges start with a clear expectation and a low-pressure hello.</p><Link to="/register" className="text-link">Create your profile <HiArrowUpRight /></Link></div>
          <div className="faq-list">{FAQS.map(([question, answer], index) => <div className={`faq-row ${openFaq === index ? 'is-open' : ''}`} key={question}><button onClick={() => setOpenFaq(openFaq === index ? null : index)} aria-expanded={openFaq === index}><span>{question}</span><b>{openFaq === index ? '−' : '+'}</b></button>{openFaq === index && <p>{answer}</p>}</div>)}</div>
        </div>
      </section>

      <section className="home-cta-section"><div className="container-x"><div className="home-cta"><div><p className="eyebrow">Ready when you are</p><h2>Bring one skill.<br /><em>Leave with two.</em></h2></div><div><p>There is someone on your campus who needs exactly what you already know.</p><Link to={user ? '/explore' : '/register'} className="button button-primary">Start a skill swap <HiArrowUpRight /></Link></div><HiOutlineChatBubbleLeftRight className="cta-mark" /></div></div></section>
    </div>
  )
}

export default Home
