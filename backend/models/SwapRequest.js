// SwapRequest.js — Stores skill exchange requests between users

const mongoose = require('mongoose');

const swapRequestSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Links to the User model
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  senderTeaches: {
    type: String,
    required: true
    // What the sender will teach, e.g., "Python"
  },
  receiverTeaches: {
    type: String,
    required: true
    // What the receiver will teach in return, e.g., "Guitar"
  },
  message: {
    type: String,
    default: "Hey! I'd love to swap skills with you! 🤝"
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed'],
    default: 'pending'
    // enum means ONLY these 4 values are allowed
  }
}, { timestamps: true });

module.exports = mongoose.model('SwapRequest', swapRequestSchema);