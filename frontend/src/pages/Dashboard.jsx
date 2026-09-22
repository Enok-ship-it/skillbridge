import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import {
  HiArrowRight, HiCheckCircle, HiClock, HiOutlineAcademicCap,
  HiOutlineClipboardDocumentCheck, HiOutlineMagnifyingGlass,
  HiOutlineUserGroup, HiSparkles
} from 'react-icons/hi2'
import { useAuth } from '../context/AuthContext'

const avatarFor = (member) => member?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=skillbridge'

const Dashboard = () => {
  const { user, token } = useAuth()
  const [matches, setMatches] = useState([])
  const [swaps, setSwaps] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    const fetchData = async () => {
      setLoading(true)
      setError('')
      try {
        const headers = { Authorization: `Bearer ${token}` }
        const [matchResponse, swapResponse] = await Promise.all([
          axios.get('/api/users/matches', { headers, signal: controller.signal }),
          axios.get('/api/swaps', { headers, signal: controller.signal })
        ])
        setMatches(matchResponse.data.matches || [])
        setSwaps(swapResponse.data.swaps || [])
      } catch (requestError) {
        if (requestError.name !== 'CanceledError') setError('We could not refresh your activity. Please try again in a moment.')
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }
    if (token) fetchData()
    else setLoading(false)
    return () => controller.abort()
  }, [token])

  const identity = user?._id || user?.id
  const summary = useMemo(() => ({
    completed: swaps.filter((swap) => swap.status === 'completed').length,
    active: swaps.filter((swap) => swap.status === 'accepted').length,
    pending: swaps.filter((swap) => swap.status === 'pending' && String(swap.receiver?._id || swap.receiver) === String(identity)).length,
    matches: matches.length
  }), [swaps, matches.length, identity])

  const profileSteps = [
    { label: 'Your profile', complete: Boolean(user?.name && user?.college), note: 'Introduce yourself to your campus.' },
    { label: 'What you can teach', complete: (user?.canTeach?.length || 0) > 0, note: 'Add at least one skill you can offer.' },
    { label: 'Your learning goal', complete: (user?.wantToLearn?.length || 0) > 0, note: 'Choose the skill you want to learn next.' }
  ]
  const profileProgress = Math.round((profileSteps.filter((step) => step.complete).length / profileSteps.length) * 100)
  const firstName = user?.name?.trim().split(' ')[0] || 'there'
  const statCards = [
    { label: 'Completed exchanges', value: summary.completed, icon: HiCheckCircle, tone: 'success', detail: 'Shared knowledge sessions' },
    { label: 'Active exchanges', value: summary.active, icon: HiOutlineUserGroup, tone: 'primary', detail: 'Currently in progress' },
    { label: 'Waiting for you', value: summary.pending, icon: HiClock, tone: 'warning', detail: 'Incoming requests' },
    { label: 'Suggested partners', value: summary.matches, icon: HiSparkles, tone: 'violet', detail: 'Based on your skills' }
  ]

  return (
    <section className="product-page dashboard-page container-x">
      <header className="product-hero dashboard-hero">
        <div>
          <span className="eyebrow"><span className="live-dot" />YOUR LEARNING SPACE</span>
          <h1>Good to see you, <span>{firstName}</span>.</h1>
          <p>Keep your exchanges moving and turn your next learning goal into a real conversation.</p>
        </div>
        <div className="hero-actions">
          <Link className="button button-secondary" to="/profile">Manage profile</Link>
          <Link className="button button-primary" to="/explore">Find a partner <HiArrowRight /></Link>
        </div>
      </header>

      {error && <div className="notice notice-error" role="alert">{error}</div>}

      <div className="stats-grid dashboard-stats" aria-label="Exchange summary">
        {statCards.map(({ label, value, icon: Icon, tone, detail }) => (
          <article className={`stat-card stat-card-${tone}`} key={label}>
            <div className="stat-icon"><Icon aria-hidden="true" /></div>
            <div><p>{label}</p><strong>{loading ? '—' : value}</strong><span>{detail}</span></div>
          </article>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-main-column">
          <section className="panel panel-large" aria-labelledby="matches-heading">
            <div className="panel-heading">
              <div><span className="eyebrow">CURATED FOR YOU</span><h2 id="matches-heading">Recommended partners</h2><p>Students who can help you learn what is next.</p></div>
              <Link className="text-link" to="/explore">Explore all <HiArrowRight /></Link>
            </div>
            {loading ? <MatchSkeleton /> : matches.length === 0 ? (
              <div className="empty-state empty-state-inline">
                <div className="empty-icon"><HiOutlineMagnifyingGlass /></div>
                <h3>Your best matches start with your profile.</h3>
                <p>Add both teaching and learning skills and we will surface relevant peers automatically.</p>
                <Link to="/profile" className="button button-primary">Complete profile <HiArrowRight /></Link>
              </div>
            ) : (
              <div className="match-list">
                {matches.slice(0, 4).map((member) => {
                  const theyTeach = member.canTeach?.filter((skill) => user?.wantToLearn?.includes(skill)) || []
                  const youTeach = member.wantToLearn?.filter((skill) => user?.canTeach?.includes(skill)) || []
                  const mutual = youTeach.length > 0
                  return (
                    <article className="match-row" key={member._id}>
                      <img className="member-avatar" src={avatarFor(member)} alt={`${member.name}'s avatar`} />
                      <div className="match-person">
                        <div className="match-person-title"><h3>{member.name}</h3><span className={mutual ? 'match-badge mutual' : 'match-badge'}>{mutual ? 'Mutual match' : 'Strong fit'}</span></div>
                        <p>{member.branch || 'Student'} · Year {member.year || '—'}{member.college ? ` · ${member.college}` : ''}</p>
                        <div className="skill-relationship">
                          {theyTeach.slice(0, 2).map((skill) => <span className="skill-chip skill-chip-learn" key={`learn-${skill}`}>Learn {skill}</span>)}
                          {youTeach.slice(0, 1).map((skill) => <span className="skill-chip skill-chip-teach" key={`teach-${skill}`}>Teach {skill}</span>)}
                        </div>
                      </div>
                      <Link className="icon-button" to="/explore" aria-label={`Explore swaps with ${member.name}`}><HiArrowRight /></Link>
                    </article>
                  )
                })}
              </div>
            )}
          </section>

          <section className="panel" aria-labelledby="activity-heading">
            <div className="panel-heading compact"><div><span className="eyebrow">EXCHANGE HISTORY</span><h2 id="activity-heading">Recent activity</h2></div><Link className="text-link" to="/swaps">View requests <HiArrowRight /></Link></div>
            {loading ? <ActivitySkeleton /> : swaps.length === 0 ? (
              <div className="activity-empty"><HiOutlineClipboardDocumentCheck /><span>Your exchange timeline will appear here.</span></div>
            ) : (
              <div className="activity-list">
                {swaps.slice(0, 4).map((swap) => {
                  const isSender = String(swap.sender?._id || swap.sender) === String(identity)
                  const peer = isSender ? swap.receiver : swap.sender
                  return <div className="activity-item" key={swap._id}><img className="activity-avatar" src={avatarFor(peer)} alt="" /><div><p><strong>{peer?.name || 'A student'}</strong> {isSender ? 'received your request' : 'sent you a request'}.</p><span>{swap.senderTeaches} ↔ {swap.receiverTeaches}</span></div><span className={`status-pill status-${swap.status}`}>{swap.status}</span></div>
                })}
              </div>
            )}
          </section>
        </div>

        <aside className="dashboard-side-column">
          <section className="panel readiness-card" aria-labelledby="readiness-heading">
            <div className="readiness-topline"><div><span className="eyebrow">PROFILE READINESS</span><h2 id="readiness-heading">{profileProgress}% complete</h2></div><div className="progress-ring" style={{ '--progress': `${profileProgress * 3.6}deg` }}><span>{profileProgress}%</span></div></div>
            <div className="progress-track"><span style={{ width: `${profileProgress}%` }} /></div>
            <div className="readiness-list">
              {profileSteps.map((step) => <div className="readiness-step" key={step.label}><span className={step.complete ? 'step-check complete' : 'step-check'}>{step.complete ? <HiCheckCircle /> : <span />}</span><div><strong>{step.label}</strong><p>{step.complete ? 'Ready' : step.note}</p></div></div>)}
            </div>
            {profileProgress < 100 && <Link to="/profile" className="button button-secondary readiness-button">Finish your profile <HiArrowRight /></Link>}
          </section>
          <section className="practice-card"><HiOutlineAcademicCap aria-hidden="true" /><span className="eyebrow">GOOD PRACTICE</span><h2>Agree on a clear session goal.</h2><p>Before accepting, decide what you will teach, what you expect to learn, and how long the session will take.</p><Link to="/community-guidelines">Read the guidelines <HiArrowRight /></Link></section>
        </aside>
      </div>
    </section>
  )
}

const MatchSkeleton = () => <div className="skeleton-list" aria-label="Loading matches"><span /><span /><span /></div>
const ActivitySkeleton = () => <div className="skeleton-list activity-skeleton" aria-label="Loading activity"><span /><span /></div>

export default Dashboard
