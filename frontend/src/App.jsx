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
import { Terms, Privacy, CommunityGuidelines } from './pages/Legal'
import ScrollToTop from './components/ScrollToTop'

const PageWrap = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.25 }}
    style={{ width: '100%', display: 'block' }}
  >
    {children}
  </motion.div>
)

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '80px' }}>
        <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
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
        <ScrollToTop />
        <Navbar />

        {/* paddingTop = fixed navbar height so content is never hidden */}
        <main style={{ flex: 1, width: '100%', paddingTop: '80px' }}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<PageWrap><Home /></PageWrap>} />
              <Route path="/login" element={<PageWrap><Login /></PageWrap>} />
              <Route path="/register" element={<PageWrap><Register /></PageWrap>} />
              <Route path="/explore" element={<PageWrap><Explore /></PageWrap>} />
              <Route path="/dashboard" element={<ProtectedRoute><PageWrap><Dashboard /></PageWrap></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><PageWrap><Profile /></PageWrap></ProtectedRoute>} />
              <Route path="/swaps" element={<ProtectedRoute><PageWrap><SwapRequests /></PageWrap></ProtectedRoute>} />
              <Route path="/terms" element={<PageWrap><Terms /></PageWrap>} />
              <Route path="/privacy" element={<PageWrap><Privacy /></PageWrap>} />
              <Route path="/community-guidelines" element={<PageWrap><CommunityGuidelines /></PageWrap>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </main>

        <Footer />
      </div>
    </div>
  )
}

export default App
