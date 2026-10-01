import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { FaArrowLeft, FaMicrophone, FaPaperclip, FaPaperPlane, FaStop } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'

const Chat = () => {
  const { swapId } = useParams()
  const { token, user } = useAuth()
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [recording, setRecording] = useState(false)
  const recorder = useRef(null)
  const headers = { Authorization: `Bearer ${token}` }

  const load = async () => {
    try { const response = await axios.get(`/api/messages/${swapId}`, { headers }); setMessages(response.data.messages || []) }
    catch (error) { toast.error(error.response?.data?.message || 'Chat is unavailable') }
  }
  useEffect(() => { if (token) load(); const timer = setInterval(() => { if (token) load() }, 8000); return () => clearInterval(timer) }, [token, swapId])
  const send = async (body = text, kind = 'text') => {
    if (!body.trim()) return
    try { const response = await axios.post(`/api/messages/${swapId}`, { body, kind }, { headers }); setMessages(current => [...current, response.data.message]); setText('') }
    catch (error) { toast.error(error.response?.data?.message || 'Message could not be sent') }
  }
  const upload = (event) => {
    const file = event.target.files?.[0]; if (!file) return
    if (file.size > 350000) return toast.error('Choose a file smaller than 350 KB for this demo chat.')
    const reader = new FileReader(); reader.onload = () => send(String(reader.result), file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : 'audio'); reader.readAsDataURL(file)
  }
  const toggleRecording = async () => {
    if (recording) { recorder.current.stop(); setRecording(false); return }
    if (!navigator.mediaDevices?.getUserMedia) return toast.error('Voice notes are not supported in this browser.')
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true }); const chunks = []; const next = new MediaRecorder(stream)
    next.ondataavailable = e => chunks.push(e.data); next.onstop = () => { const reader = new FileReader(); reader.onload = () => send(String(reader.result), 'audio'); reader.readAsDataURL(new Blob(chunks, { type: 'audio/webm' })); stream.getTracks().forEach(track => track.stop()) }
    recorder.current = next; next.start(); setRecording(true)
  }
  return <section className="product-page container-x chat-page"><Link to="/swaps" className="back-link"><FaArrowLeft /> Back to exchanges</Link><header className="product-hero"><div><span className="eyebrow">PRIVATE EXCHANGE ROOM</span><h1>Learn together, <span>in real time.</span></h1><p>Only accepted exchange partners can see this room.</p></div></header><div className="chat-shell">{messages.length === 0 && <div className="chat-empty">Start with a thoughtful hello. Your contact details remain private until an exchange is accepted.</div>}{messages.map(message => <div key={message._id} className={`chat-message ${String(message.sender?._id) === String(user?._id || user?.id) ? 'mine' : ''}`}><strong>{message.sender?.name || 'Partner'}</strong>{message.kind === 'text' ? <p>{message.body}</p> : message.kind === 'image' ? <img src={message.body} alt="Shared upload" /> : message.kind === 'video' ? <video controls src={message.body} /> : <audio controls src={message.body} />}</div>)}<div className="chat-composer"><textarea value={text} onChange={e => setText(e.target.value)} placeholder="Write a message..." onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }} /><label className="icon-button" title="Share photo, video or audio"><FaPaperclip /><input hidden type="file" accept="image/*,video/*,audio/*" onChange={upload} /></label><button className={`icon-button ${recording ? 'recording' : ''}`} onClick={toggleRecording} title={recording ? 'Stop voice note' : 'Record voice note'}>{recording ? <FaStop /> : <FaMicrophone />}</button><button className="button button-primary" onClick={() => send()}><FaPaperPlane /> Send</button></div></div></section>
}
export default Chat
