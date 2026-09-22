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

    if (!receiverId || !String(senderTeaches || '').trim() || !String(receiverTeaches || '').trim()) {
      return res.status(400).json({
        success: false,
        message: "Choose a partner and both skills for the exchange"
      });
    }

    // Prevent sending request to yourself
    if (String(receiverId) === String(req.userId)) {
      return res.status(400).json({
        success: false,
        message: "You can't swap skills with yourself! 😄"
      });
    }

    const [sender, receiver] = await Promise.all([
      User.findById(req.userId).select('canTeach wantToLearn'),
      User.findById(receiverId).select('canTeach wantToLearn')
    ]);

    if (!sender || !receiver) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    const offeredSkill = String(senderTeaches).trim();
    const requestedSkill = String(receiverTeaches).trim();
    if (!sender.canTeach.includes(offeredSkill) || !receiver.canTeach.includes(requestedSkill)) {
      return res.status(400).json({
        success: false,
        message: "Each proposed skill must be listed on the relevant profile"
      });
    }

    // One pending proposal per pair keeps the conversation clear.
    const existing = await SwapRequest.findOne({
      status: 'pending',
      $or: [
        { sender: req.userId, receiver: receiverId },
        { sender: receiverId, receiver: req.userId }
      ],
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
      senderTeaches: offeredSkill,
      receiverTeaches: requestedSkill,
      message: String(message || "Hi! I'd like to plan a skill exchange with you.").trim().slice(0, 280)
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
      .populate('sender', 'name avatar branch year college canTeach')
      .populate('receiver', 'name avatar branch year college wantToLearn')
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

    if (!['accepted', 'rejected', 'completed'].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid swap status" });
    }

    const swap = await SwapRequest.findById(req.params.id);

    if (!swap) {
      return res.status(404).json({
        success: false,
        message: "Swap request not found"
      });
    }

    const isSender = swap.sender.toString() === req.userId;
    const isReceiver = swap.receiver.toString() === req.userId;
    if (!isSender && !isReceiver) {
      return res.status(403).json({ success: false, message: "You are not part of this exchange" });
    }

    // Only the receiver can accept/reject a pending request.
    if (['accepted', 'rejected'].includes(status) &&
        (!isReceiver || swap.status !== 'pending')) {
      return res.status(403).json({
        success: false,
        message: "Only the receiver can respond to a pending request"
      });
    }

    if (status === 'completed' && swap.status !== 'accepted') {
      return res.status(400).json({ success: false, message: "Only an accepted exchange can be completed" });
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
