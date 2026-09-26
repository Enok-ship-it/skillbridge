// server.js — This is the MAIN entry point of your backend
// It starts the server, connects to database, and loads all routes

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const User = require('./models/User');
const SwapRequest = require('./models/SwapRequest');

// MIDDLEWARE — These run before every request
// cors() allows your frontend (React) to talk to this backend
app.use(cors());
// express.json() converts incoming JSON data into JavaScript objects
app.use(express.json());

// DATABASE CONNECTION
// mongoose.connect() connects to your MongoDB Atlas cloud database
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.log("❌ Database Connection Failed:", err));

// ROUTES — Each route file handles a specific feature
// /api/auth handles login & registration
app.use('/api/auth', require('./routes/auth'));
// /api/users handles profile & search
app.use('/api/users', require('./routes/user'));
// /api/swaps handles skill exchange requests
app.use('/api/swaps', require('./routes/swaps'));
app.get('/api/stats', async (req, res) => {
  try {
    const [students, skillGroups, exchanges, completedExchanges] = await Promise.all([
      User.countDocuments(),
      User.aggregate([
        { $project: { skills: { $setUnion: ['$canTeach', '$wantToLearn'] } } },
        { $unwind: '$skills' },
        { $group: { _id: '$skills' } },
        { $count: 'total' }
      ]),
      SwapRequest.countDocuments(),
      SwapRequest.countDocuments({ status: 'completed' })
    ]);
    res.json({ students, skills: skillGroups[0]?.total || 0, exchanges, completedExchanges });
  } catch (error) {
    console.error('Public stats unavailable:', error.message);
    res.status(503).json({ message: 'Community stats are temporarily unavailable.' });
  }
});
// /api/reviews handles ratings after sessions
//app.use('/api/reviews', require('./routes/reviews'));

// START SERVER
app.get('/', (req, res) => {
  res.send('<h1>🎓 SkillBridge Backend API is Running & Connected to Database! 🚀</h1>');
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 SkillBridge Server running on http://localhost:${PORT}`);
});