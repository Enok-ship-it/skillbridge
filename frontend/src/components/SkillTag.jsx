import { motion } from 'framer-motion'

const SkillTag = ({ skill, color = "purple" }) => {
  const colors = {
    purple: "from-purple-500/20 to-blue-500/20 border-purple-500/30 text-purple-300",
    green: "from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-300",
    orange: "from-orange-500/20 to-yellow-500/20 border-orange-500/30 text-orange-300",
    pink: "from-pink-500/20 to-rose-500/20 border-pink-500/30 text-pink-300"
  }

  return (
    <motion.span
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className={`inline-block px-3 py-1 rounded-full text-xs font-medium
        bg-gradient-to-r border ${colors[color]} cursor-default`}
    >
      {skill}
    </motion.span>
  )
}

export default SkillTag