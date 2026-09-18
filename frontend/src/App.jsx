import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Explore from './pages/Explore'
import Profile from './pages/Profile'
import SwapRequests from './pages/SwapRequests'

const PageWrap = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3, ease: "easeOut" }}
  >
    {children}
  </motion.div>
)

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-5">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-cyan-500/20 rounded-full"></div>
          <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin absolute inset-0"></div>
        </div>
        <p className="text-slate-500 text-sm animate-pulse">Loading SkillBridge...</p>
      </div>
    )
  }
  return user ? children : <Navigate to="/login" replace />
}

function App() {
  const location = useLocation()

  return (
    <div className="bg-animated min-h-screen relative flex flex-col">
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="orb orb-3"></div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<PageWrap><Home /></PageWrap>} />
              <Route path="/login" element={<PageWrap><Login /></PageWrap>} />
              <Route path="/register" element={<PageWrap><Register /></PageWrap>} />
              <Route path="/explore" element={<PageWrap><Explore /></PageWrap>} />
              <Route path="/dashboard" element={<ProtectedRoute><PageWrap><Dashboard /></PageWrap></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><PageWrap><Profile /></PageWrap></ProtectedRoute>} />
              <Route path="/swaps" element={<ProtectedRoute><PageWrap><SwapRequests /></PageWrap></ProtectedRoute>} />
            </Routes>
          </AnimatePresence>
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default App