import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { HiMenu, HiX } from 'react-icons/hi'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setOpen(false) }, [location])

  const links = [
    { to: "/", label: "Home" },
    { to: "/explore", label: "Explore" },
    ...(user ? [
      { to: "/dashboard", label: "Dashboard" },
      { to: "/swaps", label: "My Swaps" }
    ] : [])
  ]

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        background: scrolled ? 'rgba(5,6,15,0.9)' : 'rgba(5,6,15,0.4)',
        backdropFilter: 'blur(26px)',
        WebkitBackdropFilter: 'blur(26px)',
        borderBottom: scrolled ? '1px solid rgba(34,211,238,0.14)' : '1px solid rgba(255,255,255,0.05)',
        boxShadow: scrolled ? '0 8px 30px -14px rgba(0,0,0,0.7)' : 'none',
        transition: 'background .3s, border-color .3s, box-shadow .3s'
      }}
    >
      <div className="container-x" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        paddingTop: '16px', paddingBottom: '16px', gap: '24px'
      }}>

        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <motion.span
            whileHover={{ rotate: [0, -16, 16, 0], scale: 1.18 }}
            transition={{ duration: 0.5 }}
            style={{ fontSize: '25px', lineHeight: 1 }}
          >
            🎓
          </motion.span>
          <span className="gradient-text" style={{ fontSize: '20px', fontWeight: 900, letterSpacing: '-0.02em' }}>
            SkillBridge
          </span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }} className="nav-links-desktop">
          {links.map(l => {
            const active = location.pathname === l.to
            return (
              <Link
                key={l.to}
                to={l.to}
                style={{
                  position: 'relative',
                  padding: '9px 18px',
                  borderRadius: '10px',
                  fontSize: '14.5px',
                  fontWeight: 500,
                  color: active ? '#67e8f9' : '#94a3b8',
                  background: active ? 'rgba(34,211,238,0.08)' : 'transparent',
                  transition: 'color .25s, background .25s',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)' } }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'transparent' } }}
              >
                {l.label}
                {active && (
                  <motion.div
                    layoutId="navUnderline"
                    style={{
                      position: 'absolute', bottom: '2px', left: '50%',
                      transform: 'translateX(-50%)',
                      width: '22px', height: '2px', borderRadius: '2px',
                      background: 'linear-gradient(90deg, #22d3ee, #fbbf24)'
                    }}
                  />
                )}
              </Link>
            )
          })}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }} className="nav-auth-desktop">
          {user ? (
            <>
              <Link to="/profile" style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '6px 12px', borderRadius: '12px', transition: 'background .25s'
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <img src={user.avatar} alt="" style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  border: '2px solid rgba(34,211,238,0.4)'
                }} />
                <span style={{ fontSize: '14px', fontWeight: 600 }}>{user.name?.split(' ')[0]}</span>
              </Link>
              <button
                onClick={() => { logout(); navigate('/') }}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#64748b', fontSize: '14px', fontWeight: 500,
                  padding: '8px 14px', transition: 'color .25s'
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
                onMouseLeave={e => e.currentTarget.style.color = '#64748b'}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{
                color: '#cbd5e1', fontSize: '14.5px', fontWeight: 500,
                padding: '9px 16px', transition: 'color .25s'
              }}
                onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                onMouseLeave={e => e.currentTarget.style.color = '#cbd5e1'}
              >
                Login
              </Link>
              <Link to="/register" className="btn-glow" style={{ padding: '11px 24px', fontSize: '14px' }}>
                Get Started ⚡
              </Link>
            </>
          )}
        </div>

        <button
          className="nav-burger"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
          style={{ background: 'none', border: 'none', color: '#fff', fontSize: '26px', cursor: 'pointer', display: 'none' }}
        >
          {open ? <HiX /> : <HiMenu />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: 'hidden', borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(5,6,15,0.98)' }}
          >
            <div className="container-x" style={{ paddingTop: '20px', paddingBottom: '24px' }}>
              {links.map(l => (
                <Link key={l.to} to={l.to} style={{
                  display: 'block', padding: '13px 16px', borderRadius: '10px',
                  color: '#cbd5e1', fontWeight: 500, marginBottom: '4px'
                }}>
                  {l.label}
                </Link>
              ))}
              <div style={{ paddingTop: '14px', marginTop: '10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                {user ? (
                  <>
                    <Link to="/profile" style={{ display: 'block', padding: '13px 16px', borderRadius: '10px', color: '#cbd5e1', fontWeight: 500 }}>
                      Profile
                    </Link>
                    <button
                      onClick={() => { logout(); navigate('/') }}
                      style={{ width: '100%', textAlign: 'left', padding: '13px 16px', borderRadius: '10px', background: 'none', border: 'none', color: '#f87171', fontWeight: 500, cursor: 'pointer', fontSize: '15px' }}
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" style={{ display: 'block', padding: '13px 16px', borderRadius: '10px', color: '#cbd5e1', fontWeight: 500, marginBottom: '10px' }}>
                      Login
                    </Link>
                    <Link to="/register" className="btn-glow" style={{ width: '100%' }}>
                      Get Started ⚡
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 860px) {
          .nav-links-desktop, .nav-auth-desktop { display: none !important; }
          .nav-burger { display: block !important; }
        }
      `}</style>
    </motion.nav>
  )
}

export default Navbar