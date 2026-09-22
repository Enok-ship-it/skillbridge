import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { HiArrowRight, HiCheck, HiClock, HiOutlineInbox, HiOutlineUserGroup, HiXMark } from 'react-icons/hi2'
import { useAuth } from '../context/AuthContext'

const avatarFor = (member) => member?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=skillbridge'

const SwapRequests = () => {
  const { token, user } = useAuth()
  const [swaps, setSwaps] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [tab, setTab] = useState('all')
  const [busyId, setBusyId] = useState('')
  const identity = String(user?._id || user?.id || '')

  const fetchSwaps = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await axios.get('/api/swaps', { headers: { Authorization: `Bearer ${token}` } })
      setSwaps(response.data.swaps || [])
    } catch {
      setError('We could not load your requests. Please try again.')
    } finally { setLoading(false) }
  }

  useEffect(() => { if (token) fetchSwaps() }, [token])

  const updateStatus = async (id, status) => {
    setBusyId(id)
    try {
      await axios.put(`/api/swaps/${id}`, { status }, { headers: { Authorization: `Bearer ${token}` } })
      toast.success(status === 'completed' ? 'Exchange marked as completed.' : `Request ${status}.`)
      await fetchSwaps()
    } catch (requestError) {
      toast.error(requestError.response?.data?.message || 'We could not update that request.')
    } finally { setBusyId('') }
  }

  const filteredSwaps = useMemo(() => swaps.filter((swap) => {
    if (tab === 'all') return true
    const isSender = String(swap.sender?._id || swap.sender) === identity
    return tab === 'sent' ? isSender : !isSender
  }), [swaps, tab, identity])

  const counts = {
    all: swaps.length,
    received: swaps.filter((swap) => String(swap.receiver?._id || swap.receiver) === identity && swap.status === 'pending').length,
    sent: swaps.filter((swap) => String(swap.sender?._id || swap.sender) === identity && swap.status === 'pending').length
  }

  return (
    <section className="product-page swaps-page container-x">
      <header className="product-hero swaps-hero">
        <div><span className="eyebrow"><HiOutlineUserGroup /> YOUR EXCHANGES</span><h1>Make every swap <span>intentional.</span></h1><p>Review proposals, agree on the exchange, and mark the learning completed when both people are done.</p></div>
        <Link className="button button-primary" to="/explore">Find a new partner <HiArrowRight /></Link>
      </header>

      <div className="swap-tabs" role="tablist" aria-label="Filter exchange requests">
        <button role="tab" aria-selected={tab === 'all'} className={tab === 'all' ? 'active' : ''} onClick={() => setTab('all')}>All exchanges <span>{counts.all}</span></button>
        <button role="tab" aria-selected={tab === 'received'} className={tab === 'received' ? 'active' : ''} onClick={() => setTab('received')}>For you <span>{counts.received}</span></button>
        <button role="tab" aria-selected={tab === 'sent'} className={tab === 'sent' ? 'active' : ''} onClick={() => setTab('sent')}>Sent by you <span>{counts.sent}</span></button>
      </div>

      {error ? <div className="empty-state"><div className="empty-icon"><HiOutlineInbox /></div><h2>Something went wrong.</h2><p>{error}</p><button className="button button-primary" onClick={fetchSwaps}>Try again</button></div> :
        loading ? <div className="swap-list"><SwapSkeleton /><SwapSkeleton /></div> :
          filteredSwaps.length === 0 ? <div className="empty-state"><div className="empty-icon"><HiOutlineInbox /></div><h2>{tab === 'all' ? 'No exchange requests yet.' : 'Nothing here right now.'}</h2><p>{tab === 'all' ? 'A thoughtful skill exchange starts with one introduction.' : 'New requests will appear here as they arrive.'}</p>{tab === 'all' && <Link to="/explore" className="button button-primary">Explore students <HiArrowRight /></Link>}</div> :
            <div className="swap-list">{filteredSwaps.map((swap) => <SwapCard key={swap._id} swap={swap} identity={identity} busy={busyId === swap._id} onUpdate={updateStatus} />)}</div>}
    </section>
  )
}

const SwapCard = ({ swap, identity, busy, onUpdate }) => {
  const isSender = String(swap.sender?._id || swap.sender) === identity
  const peer = isSender ? swap.receiver : swap.sender
  const canRespond = !isSender && swap.status === 'pending'
  const canComplete = swap.status === 'accepted'
  const date = swap.createdAt ? new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(swap.createdAt)) : 'Recently'
  return (
    <article className="swap-card">
      <div className="swap-card-profile"><img className="member-avatar member-avatar-large" src={avatarFor(peer)} alt={`${peer?.name || 'Student'}'s avatar`} /><div><div className="swap-card-name"><h2>{peer?.name || 'Student'}</h2><span className={`status-pill status-${swap.status}`}>{swap.status}</span></div><p>{isSender ? 'You proposed this exchange' : 'Sent you an exchange proposal'} · {date}</p></div></div>
      <div className="exchange-summary"><div><span>{isSender ? 'You will teach' : `${peer?.name?.split(' ')[0] || 'They'} will teach`}</span><strong>{swap.senderTeaches}</strong></div><span className="exchange-symbol">↔</span><div><span>{isSender ? `${peer?.name?.split(' ')[0] || 'They'} will teach` : 'You will teach'}</span><strong>{swap.receiverTeaches}</strong></div></div>
      {swap.message && <blockquote>“{swap.message}”</blockquote>}
      <div className="swap-card-footer"><span>{swap.status === 'pending' ? <><HiClock /> Waiting for a response</> : swap.status === 'accepted' ? <><HiCheck /> Exchange accepted — agree on the details.</> : swap.status === 'completed' ? <><HiCheck /> Completed exchange</> : <><HiXMark /> Request closed</>}</span>{canRespond && <div><button className="button button-secondary button-small" disabled={busy} onClick={() => onUpdate(swap._id, 'rejected')}>Decline</button><button className="button button-primary button-small" disabled={busy} onClick={() => onUpdate(swap._id, 'accepted')}>{busy ? 'Saving…' : 'Accept request'}</button></div>}{canComplete && <button className="button button-primary button-small" disabled={busy} onClick={() => onUpdate(swap._id, 'completed')}>{busy ? 'Saving…' : 'Mark completed'}</button>}</div>
    </article>
  )
}

const SwapSkeleton = () => <article className="swap-card swap-skeleton" aria-label="Loading exchange"><span /><span /><span /></article>

export default SwapRequests
