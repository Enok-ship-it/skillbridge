import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import SkillTag from './SkillTag'
import { FaStar } from 'react-icons/fa'

const UserCard = ({ user, index = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    whileHover={{ y: -8, transition: { duration: 0.2 } }}
    className="glass-card p-6 cursor-pointer"
  >
    {/* Avatar & Name */}
    <div className="flex items-center gap-4 mb-4">
      <img
        src={user.avatar}
        alt={user.name}
        className="w-14 h-14 rounded-full border-2 border-purple-500/30"
      />
      <div>
        <h3 className="font-bold text-lg">{user.name}</h3>
        <p className="text-gray-400 text-sm">{user.branch} • Year {user.year}</p>
      </div>
    </div>

    {/* Rating */}
    {user.rating > 0 && (
      <div className="flex items-center gap-1 mb-3">
        <FaStar className="text-yellow-400" />
        <span className="text-yellow-400 font-semibold">{user.rating}</span>
        <span className="text-gray-500 text-sm">({user.totalReviews} reviews)</span>
      </div>
    )}

    {/* Skills */}
    {user.canTeach?.length > 0 && (
      <div className="mb-3">
        <p className="text-xs text-gray-500 mb-1">Can Teach:</p>
        <div className="flex flex-wrap gap-1">
          {user.canTeach.slice(0, 3).map(skill => (
            <SkillTag key={skill} skill={skill} color="green" />
          ))}
          {user.canTeach.length > 3 && (
            <span className="text-xs text-gray-500">+{user.canTeach.length - 3}</span>
          )}
        </div>
      </div>
    )}

    {user.wantToLearn?.length > 0 && (
      <div>
        <p className="text-xs text-gray-500 mb-1">Wants to Learn:</p>
        <div className="flex flex-wrap gap-1">
          {user.wantToLearn.slice(0, 3).map(skill => (
            <SkillTag key={skill} skill={skill} color="orange" />
          ))}
        </div>
      </div>
    )}

    {/* Stats */}
    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs text-gray-500">
      <span>🔄 {user.totalSwaps || 0} swaps</span>
      <span>📅 Joined {new Date(user.createdAt).toLocaleDateString()}</span>
    </div>
  </motion.div>
)

export default UserCard