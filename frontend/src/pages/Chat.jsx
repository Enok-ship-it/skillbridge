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
  const [recordingSeconds, setRecordingSeconds] = useState(0)
  const [voiceStatus, setVoiceStatus] = useState('')
  const [sending, setSending] = useState(false)
  const recorder = useRef(null)
  const streamRef = useRef(null)
  const chunksRef = useRef([])
  const timerRef = useRef(null)
  const headers = { Authorization: `Bearer ${token}` }

  const load = async () => {
    try { const response = await axios.get(`/api/messages/${swapId}`, { headers }); setMessages(response.data.messages || []) }
    catch (error) { toast.error(error.response?.data?.message || 'Chat is unavailable') }
  }
  useEffect(() => {
    if (token) load()
    const timer = setInterval(() => { if (token) load() }, 8000)
    return () => {
      clearInterval(timer)
      clearInterval(timerRef.current)
      streamRef.current?.getTracks().forEach(track => track.stop())
    }
  }, [token, swapId])
  const send = async (body = text, kind = 'text') => {
    if (!body || !String(body).trim()) return false
    setSending(true)
    try { const response = await axios.post(`/api/messages/${swapId}`, { body, kind }, { headers }); setMessages(current => [...current, response.data.message]); setText(''); return true }
    catch (error) { toast.error(error.response?.data?.message || 'Message could not be sent') }
    finally { setSending(false) }
    return false
  }
  const upload = (event) => {
    const file = event.target.files?.[0]; if (!file) return
    if (file.size > 350000) return toast.error('Choose a file smaller than 350 KB for this demo chat.')
    const reader = new FileReader(); reader.onload = () => send(String(reader.result), file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : 'audio'); reader.readAsDataURL(file)
  }
  const stopRecording = () => {
    if (!recorder.current || recorder.current.state === 'inactive') return
    setVoiceStatus('Preparing voice note…')
    recorder.current.stop()
  }
  const toggleRecording = async () => {
    if (recording) return stopRecording()
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') return toast.error('Voice notes are not supported in this browser.')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mimeType = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4'].find(type => MediaRecorder.isTypeSupported?.(type)) || ''
      const next = new MediaRecorder(stream, mimeType ? { mimeType } : undefined)
      chunksRef.current = []
      streamRef.current = stream
      next.ondataavailable = event => { if (event.data.size) chunksRef.current.push(event.data) }
      next.onerror = () => { setVoiceStatus('Recording failed. Please try again.'); stream.getTracks().forEach(track => track.stop()); setRecording(false) }
      next.onstop = async () => {
        clearInterval(timerRef.current)
        stream.getTracks().forEach(track => track.stop())
        streamRef.current = null
        recorder.current = null
        setRecording(false)
        setRecordingSeconds(0)
        const blob = new Blob(chunksRef.current, { type: next.mimeType || 'audio/webm' })
        if (!blob.size) return setVoiceStatus('No audio captured. Try holding the button a little longer.')
        const reader = new FileReader()
        reader.onload = async () => {
          const sent = await send(String(reader.result), 'audio')
          setVoiceStatus(sent ? 'Voice note sent' : 'Voice note was not sent')
        }
        reader.onerror = () => setVoiceStatus('Could not prepare that voice note.')
        reader.readAsDataURL(blob)
      }
      recorder.current = next
      next.start()
      setRecording(true)
      setRecordingSeconds(0)
      setVoiceStatus('Recording… tap Stop when you are done')
      timerRef.current = setInterval(() => setRecordingSeconds(seconds => seconds + 1), 1000)
    } catch (error) {
      setVoiceStatus('')
      toast.error(error.name === 'NotAllowedError' ? 'Microphone permission was denied. Allow it in your browser and try again.' : 'Could not access your microphone.')
    }
  }
  return <section className="product-page container-x chat-page"><Link to="/swaps" className="back-link"><FaArrowLeft /> Back to exchanges</Link><header className="product-hero"><div><span className="eyebrow">PRIVATE EXCHANGE ROOM</span><h1>Learn together, <span>in real time.</span></h1><p>Only accepted exchange partners can see this room.</p></div></header><div className="chat-shell">{messages.length === 0 && <div className="chat-empty">Start with a thoughtful hello. Your contact details remain private until an exchange is accepted.</div>}{messages.map(message => <div key={message._id} className={`chat-message ${String(message.sender?._id) === String(user?._id || user?.id) ? 'mine' : ''}`}><strong>{message.sender?.name || 'Partner'}</strong>{message.kind === 'text' ? <p>{message.body}</p> : message.kind === 'image' ? <img src={message.body} alt="Shared upload" /> : message.kind === 'video' ? <video controls src={message.body} /> : <audio controls src={message.body} />}</div>)}<div className="chat-composer"><textarea value={text} onChange={e => setText(e.target.value)} placeholder="Write a message..." onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }} /><label className="icon-button" title="Share photo, video or audio"><FaPaperclip /><input hidden type="file" accept="image/*,video/*,audio/*" onChange={upload} /></label><button className={`icon-button ${recording ? 'recording' : ''}`} onClick={toggleRecording} disabled={sending} title={recording ? 'Stop voice note' : 'Start voice note'}>{recording ? <FaStop /> : <FaMicrophone />}</button><button className="button button-primary" onClick={() => send()} disabled={sending}><FaPaperPlane /> {sending ? 'Sending…' : 'Send'}</button></div>{voiceStatus && <div className="voice-panel"><strong>{recording ? `Recording ${recordingSeconds}s` : voiceStatus}</strong>{recording && <button type="button" className="button button-secondary" onClick={stopRecording}>Stop recording</button>}</div>}</div></section>
}
export default Chat
