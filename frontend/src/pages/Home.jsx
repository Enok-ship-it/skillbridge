import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Lightning from '../components/Lightning'
import Counter from '../components/Counter'
import { FiChevronDown } from 'react-icons/fi'

const SKILL_CHIPS = [
  "⚡ Python", "🎸 Guitar", "🎨 Photoshop", "🌐 Web Dev", "🗣️ Spoken English",
  "📊 Data Science", "🎬 Video Editing", "☕ Java", "🎹 Piano", "📱 Flutter",
  "🤖 Machine Learning", "✍️ Content Writing", "📐 AutoCAD", "🎯 Digital Marketing"
]

const STEPS = [
  { icon: "📝", title: "Create Profile", desc: "List the skills you can teach and the ones you're hungry to learn.", step: "01", accent: "#22d3ee" },
  { icon: "🔗", title: "Get Matched", desc: "Our algorithm surfaces students whose skills perfectly complement yours.", step: "02", accent: "#818cf8" },
  { icon: "🤝", title: "Start Swapping", desc: "Connect, schedule a session, and exchange knowledge at zero cost.", step: "03", accent: "#fbbf24" }
]

const FEATURES = [
  { e: "💰", t: "100% Free", d: "No subscriptions, no hidden fees. Knowledge is the only currency here.", c: "#22d3ee" },
  { e: "🤝", t: "Peer-to-Peer", d: "Learn from students who remember exactly what confused them.", c: "#818cf8" },
  { e: "⚡", t: "Smart Matching", d: "An algorithm built to find genuine two-way skill exchanges.", c: "#fbbf24" },
  { e: "⭐", t: "Verified Quality", d: "A rating system that surfaces the best mentors on campus.", c: "#22d3ee" },
  { e: "🎯", t: "Career Focused", d: "Build the practical skills that employers actually screen for.", c: "#818cf8" },
  { e: "🌍", t: "SDG Aligned", d: "Directly supports UN Goal 4 — Quality Education for everyone.", c: "#fbbf24" }
]

const TESTIMONIALS = [
  { name: "Ananya S.", role: "BCA · 2nd Year", text: "I taught Photoshop and learned Python in return. Zero rupees spent, and I built my first project in three weeks.", avatar: "Ananya" },
  { name: "Rohit K.", role: "BTech · 3rd Year", text: "Found a guitar teacher in my own hostel. In exchange, I tutor him in Data Structures. It just works.", avatar: "Rohit" },
  { name: "Simran P.", role: "BBA · 1st Year", text: "The matching feature is scary accurate. Got paired with someone who needed exactly what I could offer.", avatar: "Simran" }
]

const FAQS = [
  { q: "Is SkillBridge really free?", a: "One hundred percent free, forever. There is no payment gateway, no subscription tier, and no premium upgrade. Your knowledge is the only currency that moves on this platform." },
  { q: "How does the matching algorithm work?", a: "We compare your 'Want to Learn' list against every user's 'Can Teach' list, then verify the reverse is also true. When both directions align, it registers as a mutual match — a genuine two-way exchange rather than one-sided tutoring." },
  { q: "Do I need to be an expert to teach?", a: "Not at all. If you are one step ahead of someone, you can help them. Peer learning works precisely because you still remember what confused you when you were learning it." },
  { q: "Is my data safe?", a: "Yes. Passwords are hashed with bcrypt before they ever touch the database, sessions use signed JWT tokens with expiry, and every protected API route is guarded by authentication middleware." }
]

const Home = () => {
  const { user } = useAuth()
  const [openFaq, setOpenFaq] = useState(null)

  return (
    <div className="relative">

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden"
               style={{ paddingTop: '150px', paddingBottom: '120px' }}>
        <Lightning />

        <div className="container-x relative z-10 text-center">

          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 170 }}
          >
            <span className="badge-pulse">Built by Students, For Students</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            style={{
              fontSize: 'clamp(2.8rem, 7.5vw, 6rem)',
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              marginTop: '34px',
              marginBottom: '28px'
            }}
          >
            Learn by <span className="gradient-text glow-cyan">Teaching</span>
            <br />
            Grow by <span className="gradient-amber glow-amber">Sharing</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            style={{
              fontSize: 'clamp(1rem, 1.6vw, 1.18rem)',
              color: '#94a3b8',
              maxWidth: '620px',
              margin: '0 auto 44px auto',
              lineHeight: 1.75
            }}
          >
            Stop paying for courses. Exchange skills directly with fellow students.
            Teach what you know, learn what you need —{' '}
            <span style={{ color: '#fff', fontWeight: 600 }}>completely free.</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="btn-row"
            style={{ marginBottom: '80px' }}
          >
            <Link to={user ? "/explore" : "/register"} className="btn-glow">
              {user ? "Find Skill Partners" : "Start Swapping Free"} ⚡
            </Link>
            <Link to="/explore" className="btn-outline">
              Explore Students →
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '20px',
              maxWidth: '620px',
              margin: '0 auto'
            }}
          >
            {[
              { end: 500,  label: "Active Students", cls: "gradient-cyan" },
              { end: 50,   label: "Skills Offered",  cls: "gradient-amber" },
              { end: 1000, label: "Swaps Made",      cls: "gradient-text" }
            ].map((s) => (
              <motion.div key={s.label} whileHover={{ scale: 1.08, y: -5 }} className="text-center">
                <div className={s.cls} style={{ fontSize: 'clamp(1.9rem, 4vw, 3rem)', fontWeight: 900, lineHeight: 1.1 }}>
                  <Counter end={s.end} suffix="+" />
                </div>
                <div style={{ color: '#64748b', fontSize: '13px', marginTop: '8px', fontWeight: 500 }}>
                  {s.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          style={{ position: 'absolute', bottom: '34px', left: '50%', transform: 'translateX(-50%)', color: '#475569', fontSize: '26px', zIndex: 10 }}
        >
          <FiChevronDown />
        </motion.div>
      </section>

      {/* ═══════════ MARQUEE ═══════════ */}
      <section style={{
        position: 'relative', zIndex: 10,
        paddingTop: '44px', paddingBottom: '44px',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        background: 'rgba(255,255,255,0.012)'
      }}>
        <p style={{
          textAlign: 'center', color: '#64748b', fontSize: '11px',
          fontWeight: 800, letterSpacing: '3.5px', textTransform: 'uppercase',
          marginBottom: '28px'
        }}>
          Skills Being Swapped Right Now
        </p>
        <div className="marquee">
          <div className="marquee-track">
            {SKILL_CHIPS.map((s, i) => <span key={i} className="marquee-chip">{s}</span>)}
          </div>
          <div className="marquee-track" aria-hidden="true">
            {SKILL_CHIPS.map((s, i) => <span key={`d-${i}`} className="marquee-chip">{s}</span>)}
          </div>
        </div>
      </section>

      {/* ═══════════ HOW IT WORKS ═══════════ */}
      <section className="section">
        <div className="container-x">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-head"
          >
            <span className="section-label">The Process</span>
            <h2 className="section-title">How It <span className="gradient-text">Works</span></h2>
            <p className="section-sub">Three steps between you and your next skill.</p>
            <div className="divider-glow" />
          </motion.div>

          <div className="grid-3">
            {STEPS.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.13, duration: 0.55 }}
                className="glass-card"
              >
                <div className="card-pad" style={{ textAlign: 'center', position: 'relative', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <span style={{
                    position: 'absolute', top: '18px', right: '24px',
                    fontSize: '58px', fontWeight: 900, lineHeight: 1,
                    color: item.accent, opacity: 0.09
                  }}>
                    {item.step}
                  </span>

                  <div style={{ fontSize: '44px', marginBottom: '18px', lineHeight: 1 }}>{item.icon}</div>
                  <h3 style={{ fontSize: '19px', fontWeight: 700, marginBottom: '12px' }}>{item.title}</h3>
                  <p style={{ color: '#94a3b8', fontSize: '14.5px', lineHeight: 1.7, flex: 1 }}>{item.desc}</p>

                  <div style={{
                    height: '2px', marginTop: '22px', borderRadius: '2px',
                    background: `linear-gradient(90deg, transparent, ${item.accent}, transparent)`,
                    opacity: 0.4
                  }} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ WHY SKILLBRIDGE ═══════════ */}
      <section className="section">
        <div className="container-x">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-head"
          >
            <span className="section-label">The Advantage</span>
            <h2 className="section-title">Why <span className="gradient-amber">SkillBridge</span>?</h2>
            <p className="section-sub">Six reasons students choose peer exchange over paid courses.</p>
            <div className="divider-glow" />
          </motion.div>

          <div className="grid-3">
            {FEATURES.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.5 }}
                className="glass-card"
              >
                <div className="card-pad" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div className="icon-tile" style={{
                    background: `linear-gradient(135deg, ${item.c}22, ${item.c}08)`,
                    border: `1px solid ${item.c}33`,
                    marginBottom: '20px'
                  }}>
                    {item.e}
                  </div>
                  <h3 style={{ fontSize: '17.5px', fontWeight: 700, marginBottom: '10px' }}>{item.t}</h3>
                  <p style={{ color: '#94a3b8', fontSize: '14.5px', lineHeight: 1.7 }}>{item.d}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ TESTIMONIALS ═══════════ */}
      <section className="section">
        <div className="container-x">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-head"
          >
            <span className="section-label">Real Stories</span>
            <h2 className="section-title">Students <span className="gradient-cyan">Love It</span></h2>
            <div className="divider-glow" />
          </motion.div>

          <div className="grid-3">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                className="glass-card"
              >
                <div className="card-pad" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ color: '#fbbf24', fontSize: '14px', letterSpacing: '2px', marginBottom: '16px' }}>
                    ★★★★★
                  </div>
                  <p style={{ color: '#cbd5e1', fontSize: '14.5px', lineHeight: 1.75, flex: 1, marginBottom: '24px' }}>
                    "{t.text}"
                  </p>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '13px',
                    paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.06)'
                  }}>
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${t.avatar}`}
                      alt={t.name}
                      style={{ width: '44px', height: '44px', borderRadius: '50%', border: '2px solid rgba(34,211,238,0.3)' }}
                    />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '14.5px' }}>{t.name}</div>
                      <div style={{ color: '#64748b', fontSize: '12.5px' }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ FAQ ═══════════ */}
      <section className="section">
        <div className="container-x" style={{ maxWidth: '820px' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-head"
          >
            <span className="section-label">Questions</span>
            <h2 className="section-title">Frequently <span className="gradient-text">Asked</span></h2>
            <div className="divider-glow" />
          </motion.div>

          <div>
            {FAQS.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="glass-card faq-item"
              >
                <button className="faq-btn" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span>{faq.q}</span>
                  <motion.span
                    animate={{ rotate: openFaq === i ? 45 : 0 }}
                    transition={{ duration: 0.25 }}
                    style={{ color: '#22d3ee', fontSize: '26px', fontWeight: 300, lineHeight: 1, flexShrink: 0 }}
                  >
                    +
                  </motion.span>
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: openFaq === i ? 'auto' : 0, opacity: openFaq === i ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ overflow: 'hidden' }}
                >
                  <p className="faq-answer">{faq.a}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ FINAL CTA ═══════════ */}
      <section className="section">
        <div className="container-x">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card"
            style={{ maxWidth: '900px', margin: '0 auto', overflow: 'hidden' }}
          >
            <div style={{ padding: '72px 36px', textAlign: 'center', position: 'relative' }}>
              <div style={{
                position: 'absolute', top: '-90px', left: '-90px',
                width: '280px', height: '280px', borderRadius: '50%',
                background: 'rgba(34,211,238,0.14)', filter: 'blur(90px)', pointerEvents: 'none'
              }} />
              <div style={{
                position: 'absolute', bottom: '-90px', right: '-90px',
                width: '280px', height: '280px', borderRadius: '50%',
                background: 'rgba(251,191,36,0.12)', filter: 'blur(90px)', pointerEvents: 'none'
              }} />

              <div style={{ position: 'relative', zIndex: 2 }}>
                <motion.div
                  animate={{ scale: [1, 1.22, 1], rotate: [0, 9, -9, 0] }}
                  transition={{ repeat: Infinity, duration: 3.5 }}
                  style={{ fontSize: '54px', marginBottom: '22px', lineHeight: 1 }}
                >
                  ⚡
                </motion.div>

                <h2 style={{
                  fontSize: 'clamp(2.1rem, 5vw, 3.5rem)',
                  fontWeight: 900, lineHeight: 1.12, marginBottom: '20px'
                }}>
                  Ready to <span className="gradient-amber glow-amber">Level Up</span>?
                </h2>

                <p style={{
                  color: '#94a3b8', fontSize: '17px',
                  maxWidth: '460px', margin: '0 auto 40px auto', lineHeight: 1.7
                }}>
                  Join hundreds of students already trading knowledge on campus.
                </p>

                <div className="btn-row">
                  <Link to={user ? "/explore" : "/register"} className="btn-thunder">
                    Join SkillBridge Now 🚀
                  </Link>
                  <Link to="/explore" className="btn-outline">
                    Browse Students
                  </Link>
                </div>

                <p style={{ color: '#475569', fontSize: '12.5px', marginTop: '30px' }}>
                  No credit card · No subscription · Free forever
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home