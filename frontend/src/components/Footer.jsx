import { Link } from 'react-router-dom'

const Footer = () => (
  <footer className="relative z-10 border-t border-white/5 mt-10 pt-16 pb-10 bg-white/[0.012]">
    <div className="container-x">
      <div className="grid md:grid-cols-4 gap-10 mb-12">

        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5 mb-4">
            <span className="text-2xl">🎓</span>
            <span className="text-xl font-black gradient-text">SkillBridge</span>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed max-w-sm mb-5">
            A peer-to-peer skill exchange platform where knowledge is the only currency.
            Built by students, for students.
          </p>
          <div className="flex gap-2 flex-wrap">
            <span className="px-3 py-1.5 rounded-lg bg-cyan-500/8 border border-cyan-500/20 text-cyan-300 text-xs font-semibold">
              React
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-green-500/8 border border-green-500/20 text-green-300 text-xs font-semibold">
              Node.js
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-emerald-500/8 border border-emerald-500/20 text-emerald-300 text-xs font-semibold">
              MongoDB
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-amber-500/8 border border-amber-500/20 text-amber-300 text-xs font-semibold">
              Express
            </span>
          </div>
        </div>

        <div>
          <h4 className="font-bold mb-4 text-sm tracking-wide">Navigate</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/" className="text-slate-400 hover:text-cyan-300 transition-colors">Home</Link></li>
            <li><Link to="/explore" className="text-slate-400 hover:text-cyan-300 transition-colors">Explore</Link></li>
            <li><Link to="/register" className="text-slate-400 hover:text-cyan-300 transition-colors">Get Started</Link></li>
            <li><Link to="/login" className="text-slate-400 hover:text-cyan-300 transition-colors">Login</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-4 text-sm tracking-wide">Impact</h4>
          <ul className="space-y-2.5 text-sm text-slate-400">
            <li>🌍 UN SDG Goal 4</li>
            <li>💰 Free Forever</li>
            <li>🤝 Peer Learning</li>
            <li>🎓 Student Built</li>
          </ul>
        </div>
      </div>

      <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-3">
        <p className="text-slate-500 text-xs">
          © 2025 SkillBridge — Learn by Teaching, Grow by Sharing.
        </p>
        <p className="text-slate-600 text-xs">
          Built with ⚡ by BCA Final Year Students
        </p>
      </div>
    </div>
  </footer>
)

export default Footer