// auth.js — Handles user Registration and Login
// This is the most critical route for security

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ==================== REGISTER ====================
// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, branch, year, college } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists"
      });
    }

    // HASH the password — NEVER store plain text passwords
    // bcrypt adds random "salt" to the password before hashing
    // This means even if two users have password "123456",
    // their hashed versions will be completely different
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user in database
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      branch: branch || "BCA",
      year: year || 3,
      college: college || "My College"
    });

    // Generate JWT token for immediate login after registration
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }  // Token expires in 7 days
    );

    res.status(201).json({
      success: true,
      message: "Registration successful! Welcome to SkillBridge 🎉",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      }
    });

  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during registration"
    });
  }
});

// ==================== LOGIN ====================
// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password"
        // We say "email or password" instead of "email not found"
        // for security — don't reveal which emails exist
      });
    }

    // Compare entered password with hashed password in database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: `Welcome back, ${user.name}! 👋`,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      }
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login"
    });
  }
});

module.exports = router;