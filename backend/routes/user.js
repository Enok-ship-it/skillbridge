// users.js — Handles user profiles, search, and skill matching

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const protect = require('../middleware/auth');

// ==================== GET MY PROFILE ====================
// GET /api/users/me
router.get('/me', protect, async (req, res) => {
  try {
    // req.userId comes from the auth middleware
    const user = await User.findById(req.userId).select('-password');
    // .select('-password') removes the password field from the response
    // NEVER send passwords back to the frontend!

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ==================== UPDATE PROFILE ====================
// PUT /api/users/me
router.put('/me', protect, async (req, res) => {
  try {
    const { name, bio, branch, year, college, canTeach, wantToLearn } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({ success: false, message: "Name is required" });
    }

    const cleanSkills = (skills) => Array.isArray(skills)
      ? [...new Set(skills.map((skill) => String(skill).trim()).filter(Boolean))].slice(0, 20)
      : [];

    if (!Number.isInteger(Number(year)) || Number(year) < 1 || Number(year) > 6) {
      return res.status(400).json({ success: false, message: "Please select a valid year" });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        name: name.trim(),
        bio: String(bio || '').trim().slice(0, 300),
        branch: String(branch || '').trim().slice(0, 60),
        year: Number(year),
        college: String(college || '').trim().slice(0, 120),
        canTeach: cleanSkills(canTeach),
        wantToLearn: cleanSkills(wantToLearn)
      },
      { new: true, runValidators: true }
      // new: true returns the UPDATED document, not the old one
      // runValidators: true checks if the new data follows the schema rules
    ).select('-password');

    res.json({
      success: true,
      message: "Profile updated successfully! ✨",
      user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ==================== EXPLORE / SEARCH USERS ====================
// GET /api/users/explore?skill=python&branch=BCA
router.get('/explore', async (req, res) => {
  try {
    const { skill, branch, year, search } = req.query;
    // req.query contains URL parameters like ?skill=python

    let query = {};

    // Build dynamic search filters
    if (skill) {
      // $or searches in BOTH canTeach and wantToLearn arrays
      query.$or = [
        { canTeach: { $regex: skill, $options: 'i' } },
        { wantToLearn: { $regex: skill, $options: 'i' } }
      ];
      // $regex allows partial matching (e.g., "pyt" matches "Python")
      // $options: 'i' makes it case-insensitive
    }

    if (branch) {
      query.branch = { $regex: branch, $options: 'i' };
    }

    if (year) {
      query.year = parseInt(year);
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ rating: -1, totalSwaps: -1 })
      // Sort by highest rating first, then most swaps
      .limit(50);

    res.json({ success: true, users, count: users.length });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ==================== SMART MATCHING ====================
// GET /api/users/matches
// This is the MAGIC feature — finds users who can teach you
// what you want AND want to learn what you can teach
router.get('/matches', protect, async (req, res) => {
  try {
    const me = await User.findById(req.userId);

    if (!me || me.wantToLearn.length === 0) {
      return res.json({ success: true, matches: [] });
    }

    // Find users who can teach at least one skill I want to learn
    const potentialMatches = await User.find({
      _id: { $ne: me._id },  // Exclude myself
      canTeach: { $in: me.wantToLearn }
      // $in checks if ANY element in canTeach matches ANY in wantToLearn
    }).select('-password');

    // Now filter for MUTUAL matches (they also want what I teach)
    const mutualMatches = potentialMatches.filter(user =>
      user.wantToLearn.some(skill => me.canTeach.includes(skill))
    );

    // Sort: mutual matches first, then by rating
    const sorted = [
      ...mutualMatches.sort((a, b) => b.rating - a.rating),
      ...potentialMatches
        .filter(u => !mutualMatches.includes(u))
        .sort((a, b) => b.rating - a.rating)
    ];

    res.json({
      success: true,
      matches: sorted.slice(0, 20),
      mutualCount: mutualMatches.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ==================== GET SINGLE USER PROFILE ====================
// Keep this dynamic route after named routes such as /matches and /explore.
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(400).json({ success: false, message: "Invalid user identifier" });
  }
});

module.exports = router;
