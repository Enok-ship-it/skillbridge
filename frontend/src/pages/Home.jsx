import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Home = () => {
  const { user } = useAuth()

  return (
    <div className="pt-20">
      {/* HERO */}
      <section className="min-h-screen flex items-center justify-center px-6 relative">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-block mb-6 px-4 py-2 rounded-full glass-card text-sm text-purple-300"
          >
            🚀 Built by Students, For Students
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-black mb-6 leading-tight"
          >
            Learn by <span className="gradient-text">Teaching</span><br />
            Grow by <span className="gradient-text">Sharing</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto mb-10"
          >
            Stop paying for courses. Exchange skills with fellow students.
            Teach what you know, learn what you need — <strong className="text-white">completely free</strong>.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to={user ? "/explore" : "/register"} className="btn-glow text-lg px-8 py-4">
              {user ? "Find Partners →" : "Start Free →"}
            </Link>
            <Link to="/explore" className="px-8 py-4 rounded-xl border border-white/20 text-gray-300 hover:bg-white/5 transition inline-block">
              Explore Students
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-20 grid grid-cols-3 gap-8 max-w-lg mx-auto"
          >
            {[{ n: "500+", l: "Students" }, { n: "50+", l: "Skills" }, { n: "1000+", l: "Swaps" }].map(s => (
              <div key={s.l} className="text-center">
                <div className="text-3xl font-black gradient-text">{s.n}</div>
                <div className="text-gray-500 text-sm">{s.l}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-center mb-16"
          >
            How It <span className="gradient-text">Works</span>
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: "📝", title: "Create Profile", desc: "Add skills you can teach and skills you want to learn.", step: "01" },
              { icon: "🔗", title: "Get Matched", desc: "Our algorithm finds students whose skills match yours.", step: "02" },
              { icon: "🤝", title: "Start Swapping", desc: "Connect, schedule sessions, and exchange knowledge!", step: "03" }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="glass-card p-8 text-center relative overflow-hidden group"
              >
                <div className="absolute top-4 right-4 text-6xl font-black text-white/5 group-hover:text-purple-500/10 transition">{item.step}</div>
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-center mb-16"
          >
            Why <span className="gradient-text">SkillBridge</span>?
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { e: "💰", t: "100% Free", d: "No subscriptions. Knowledge is the only currency." },
              { e: "🤝", t: "Peer-to-Peer", d: "Learn from real students who understand your struggles." },
              { e: "⚡", t: "Smart Matching", d: "Algorithm finds the perfect skill partner for you." },
              { e: "⭐", t: "Verified Quality", d: "Rating system ensures quality learning." },
              { e: "🎯", t: "Career Focused", d: "Build real-world skills employers want." },
              { e: "🌍", t: "SDG Aligned", d: "Supports UN Goal 4: Quality Education." }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 flex gap-4 items-start"
              >
                <span className="text-3xl">{item.e}</span>
                <div>
                  <h3 className="font-bold text-lg mb-1">{item.t}</h3>
                  <p className="text-gray-400 text-sm">{item.d}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center glass-card p-12 md:p-16"
        >
          <h2 className="text-3xl md:text-5xl font-black mb-4">Ready to <span className="gradient-text">Level Up</span>?</h2>
          <p className="text-gray-400 mb-8 text-lg">Join hundreds of students already exchanging skills.</p>
          <Link to={user ? "/explore" : "/register"} className="btn-glow text-lg px-10 py-4">
            Join SkillBridge Now 🚀
          </Link>
        </motion.div>
      </section>
    </div>
  )
}

export default Home