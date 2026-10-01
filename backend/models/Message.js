const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  swap: { type: mongoose.Schema.Types.ObjectId, ref: 'SwapRequest', required: true, index: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  kind: { type: String, enum: ['text', 'image', 'video', 'audio'], default: 'text' },
  body: { type: String, required: true, maxlength: 500000 }
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
