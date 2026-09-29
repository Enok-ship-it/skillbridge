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
        background: scrolled ? 'var(--nav-bg-strong)' : 'var(--nav-bg)',
        backdropFilter: 'blur(26px)',
        WebkitBackdropFilter: 'blur(26px)',
        borderBottom: '1px solid var(--nav-line)',
        boxShadow: scrolled ? '0 8px 30px -14px var(--nav-shadow)' : 'none',
        transition: 'background .3s, border-color .3s, box-shadow .3s'
      }}
    >
      <div className="container-x" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        paddingTop: '16px', paddingBottom: '16px', gap: '24px'
      }}>

        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <motion.span
            whileHover={{ rotate: [0, -5, 5, 0], scale: 1.08 }}
            transition={{ duration: 0.35 }}
            className="brand-mark"
            style={{ lineHeight: 1 }}
          >
            <span className="brand-mark-bolt" aria-hidden="true">↯</span>
          </motion.span>
          <span className="nav-brand-word" style={{ fontSize: '20px', fontWeight: 900, letterSpacing: '-0.02em' }}>
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
                  color: active ? 'var(--nav-active)' : 'var(--nav-muted)',
                  background: active ? 'var(--nav-active-bg)' : 'transparent',
                  transition: 'color .25s, background .25s',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.color = 'var(--nav-ink)'; e.currentTarget.style.background = 'var(--nav-hover-bg)' } }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.color = 'var(--nav-muted)'; e.currentTarget.style.background = 'transparent' } }}
              >
                {l.label}
                {active && (
                  <motion.div
                    layoutId="navUnderline"
                    style={{
                      position: 'absolute', bottom: '2px', left: '50%',
                      transform: 'translateX(-50%)',
                      width: '22px', height: '2px', borderRadius: '2px',
                      background: 'var(--nav-underline)'
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
                onMouseEnter={e => e.currentTarget.style.background = 'var(--nav-hover-bg)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <img src={user.avatar} alt="" style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  border: '2px solid var(--nav-active)'
                }} />
                <span style={{ fontSize: '14px', fontWeight: 600 }}>{user.name?.split(' ')[0]}</span>
              </Link>
              <button
                onClick={() => { logout(); navigate('/') }}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--nav-muted)', fontSize: '14px', fontWeight: 500,
                  padding: '8px 14px', transition: 'color .25s'
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--nav-danger)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--nav-muted)'}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{
                color: 'var(--nav-muted)', fontSize: '14.5px', fontWeight: 500,
                padding: '9px 16px', transition: 'color .25s'
              }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--nav-ink)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--nav-muted)'}
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
          style={{ background: 'none', border: 'none', color: 'var(--nav-ink)', fontSize: '26px', cursor: 'pointer', display: 'none' }}
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
            style={{ overflow: 'hidden', borderTop: '1px solid var(--nav-line)', background: 'var(--nav-mobile-bg)' }}
          >
            <div className="container-x" style={{ paddingTop: '20px', paddingBottom: '24px' }}>
              {links.map(l => (
                <Link key={l.to} to={l.to} style={{
                  display: 'block', padding: '13px 16px', borderRadius: '10px',
                  color: 'var(--nav-muted)', fontWeight: 500, marginBottom: '4px'
                }}>
                  {l.label}
                </Link>
              ))}
              <div style={{ paddingTop: '14px', marginTop: '10px', borderTop: '1px solid var(--nav-line)' }}>
                {user ? (
                  <>
                    <Link to="/profile" style={{ display: 'block', padding: '13px 16px', borderRadius: '10px', color: 'var(--nav-muted)', fontWeight: 500 }}>
                      Profile
                    </Link>
                    <button
                      onClick={() => { logout(); navigate('/') }}
                      style={{ width: '100%', textAlign: 'left', padding: '13px 16px', borderRadius: '10px', background: 'none', border: 'none', color: 'var(--nav-danger)', fontWeight: 500, cursor: 'pointer', fontSize: '15px' }}
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" style={{ display: 'block', padding: '13px 16px', borderRadius: '10px', color: 'var(--nav-muted)', fontWeight: 500, marginBottom: '10px' }}>
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