import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { HiMenu, HiX } from 'react-icons/hi'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 glass-card border-t-0 border-l-0 border-r-0 rounded-none"
      style={{ background: 'rgba(10, 10, 26, 0.8)' }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-3xl">🎓</span>
          <span className="text-xl font-bold gradient-text">SkillBridge</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link>
          <Link to="/explore" className="text-gray-300 hover:text-white transition-colors">Explore</Link>
          {user && (
            <>
              <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors">Dashboard</Link>
              <Link to="/swaps" className="text-gray-300 hover:text-white transition-colors">My Swaps</Link>
            </>
          )}
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/profile" className="flex items-center gap-2">
                <img src={user.avatar} alt="" className="w-8 h-8 rounded-full" />
                <span className="text-sm font-medium">{user.name}</span>
              </Link>
              <button onClick={handleLogout} className="text-gray-400 hover:text-red-400 transition-colors text-sm">
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="text-gray-300 hover:text-white transition-colors">Login</Link>
              <Link to="/register" className="btn-glow text-sm">Get Started</Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white text-2xl"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden px-6 pb-6 space-y-4"
          >
            <Link to="/" className="block text-gray-300" onClick={() => setMobileOpen(false)}>Home</Link>
            <Link to="/explore" className="block text-gray-300" onClick={() => setMobileOpen(false)}>Explore</Link>
            {user ? (
              <>
                <Link to="/dashboard" className="block text-gray-300" onClick={() => setMobileOpen(false)}>Dashboard</Link>
                <Link to="/profile" className="block text-gray-300" onClick={() => setMobileOpen(false)}>Profile</Link>
                <button onClick={handleLogout} className="text-red-400">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block text-gray-300" onClick={() => setMobileOpen(false)}>Login</Link>
                <Link to="/register" className="block btn-glow text-center" onClick={() => setMobileOpen(false)}>Get Started</Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

export default Navbar