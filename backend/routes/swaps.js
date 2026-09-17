// swaps.js — Handles skill swap requests

const express = require('express');
const router = express.Router();
const SwapRequest = require('../models/SwapRequest');
const User = require('../models/User');
const protect = require('../middleware/auth');

// ==================== SEND SWAP REQUEST ====================
// POST /api/swaps
router.post('/', protect, async (req, res) => {
  try {
    const { receiverId, senderTeaches, receiverTeaches, message } = req.body;

    // Prevent sending request to yourself
    if (receiverId === req.userId) {
      return res.status(400).json({
        success: false,
        message: "You can't swap skills with yourself! 😄"
      });
    }

    // Check if request already exists
    const existing = await SwapRequest.findOne({
      sender: req.userId,
      receiver: receiverId,
      status: 'pending'
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "You already have a pending request with this user"
      });
    }

    const swap = await SwapRequest.create({
      sender: req.userId,
      receiver: receiverId,
      senderTeaches,
      receiverTeaches,
      message: message || "Hey! Let's swap skills! 🤝"
    });

    res.status(201).json({
      success: true,
      message: "Swap request sent! 🚀",
      swap
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ==================== GET MY SWAP REQUESTS ====================
// GET /api/swaps
router.get('/', protect, async (req, res) => {
  try {
    const { type } = req.query; // 'sent' or 'received'

    let query = {};
    if (type === 'sent') {
      query.sender = req.userId;
    } else if (type === 'received') {
      query.receiver = req.userId;
    } else {
      query.$or = [
        { sender: req.userId },
        { receiver: req.userId }
      ];
    }

    const swaps = await SwapRequest.find(query)
      .populate('sender', 'name email avatar canTeach')
      .populate('receiver', 'name email avatar wantToLearn')
      // populate replaces the user ID with actual user data
      .sort({ createdAt: -1 });

    res.json({ success: true, swaps });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ==================== UPDATE SWAP STATUS ====================
// PUT /api/swaps/:id
router.put('/:id', protect, async (req, res) => {
  try {
    const { status } = req.body; // 'accepted', 'rejected', 'completed'

    const swap = await SwapRequest.findById(req.params.id);

    if (!swap) {
      return res.status(404).json({
        success: false,
        message: "Swap request not found"
      });
    }

    // Only the receiver can accept/reject
    if (['accepted', 'rejected'].includes(status) &&
        swap.receiver.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "Only the receiver can accept or reject"
      });
    }

    swap.status = status;
    await swap.save();

    // If completed, increment totalSwaps for both users
    if (status === 'completed') {
      await User.findByIdAndUpdate(swap.sender, { $inc: { totalSwaps: 1 } });
      await User.findByIdAndUpdate(swap.receiver, { $inc: { totalSwaps: 1 } });
      // $inc is a MongoDB operator that increments a number by 1
    }

    res.json({
      success: true,
      message: `Swap ${status} successfully! ✅`,
      swap
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;