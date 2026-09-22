// User.js — This defines the SHAPE of user data in the database
// Think of it as a form template. Every user must fill these fields.

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Basic Info
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true  // Removes extra spaces
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,  // No two users can have same email
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"]
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: 6
  },

  // College Info
  branch: {
    type: String,
    default: "B.Tech",
    trim: true,
    maxlength: 60
  },
  year: {
    type: Number,
    default: 4,
    min: 1,
    max: 6
  },
  college: {
    type: String,
    default: "My College",
    trim: true,
    maxlength: 120
  },

  // Skills — Arrays of strings
  canTeach: {
    type: [String],
    default: []
    // Example: ["Python", "Web Development", "Data Structures"]
  },
  wantToLearn: {
    type: [String],
    default: []
    // Example: ["Guitar", "Photoshop", "Spoken English"]
  },

  // Profile
  bio: {
    type: String,
    default: "Hey! I'm new on SkillBridge 👋",
    maxlength: 300
  },

  // Legal consent is recorded during registration rather than assumed.
  termsAcceptedAt: {
    type: Date,
    default: null
  },
  avatar: {
    type: String,
    default: "https://api.dicebear.com/7.x/avataaars/svg?seed=default"
    // This generates a random cartoon avatar automatically!
  },

  // Stats
  rating: {
    type: Number,
    default: 0
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  totalSwaps: {
    type: Number,
    default: 0
  },

}, { timestamps: true });
// timestamps: true automatically adds createdAt & updatedAt fields

module.exports = mongoose.model('User', userSchema);
