const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  room_id: { type: String, required: true },
  sender_id: { type: String, required: true },
  sender_name: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Chat', chatSchema, 'chat'); 