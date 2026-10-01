const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const SwapRequest = require('../models/SwapRequest');
const protect = require('../middleware/auth');

const participant = async (swapId, userId) => {
  const swap = await SwapRequest.findOne({ _id: swapId, status: 'accepted', $or: [{ sender: userId }, { receiver: userId }] });
  return swap;
};

router.get('/:swapId', protect, async (req, res) => {
  try {
    if (!await participant(req.params.swapId, req.userId)) return res.status(403).json({ success: false, message: 'Chat unlocks after the exchange is accepted.' });
    const messages = await Message.find({ swap: req.params.swapId }).populate('sender', 'name avatar').sort({ createdAt: 1 }).limit(200);
    res.json({ success: true, messages });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/:swapId', protect, async (req, res) => {
  try {
    if (!await participant(req.params.swapId, req.userId)) return res.status(403).json({ success: false, message: 'Chat unlocks after the exchange is accepted.' });
    const kind = ['text', 'image', 'video', 'audio'].includes(req.body.kind) ? req.body.kind : 'text';
    const body = String(req.body.body || '').trim();
    if (!body || body.length > 500000) return res.status(400).json({ success: false, message: 'Message content is invalid.' });
    const message = await Message.create({ swap: req.params.swapId, sender: req.userId, kind, body });
    await message.populate('sender', 'name avatar');
    res.status(201).json({ success: true, message });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
