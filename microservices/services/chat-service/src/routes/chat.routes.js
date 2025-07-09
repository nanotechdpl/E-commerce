const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller');

// Example route (replace with actual handlers as needed)
router.get('/test', (req, res) => {
  res.json({ message: 'Chat route is working!' });
});

// Get all messages for a room
router.get('/messages/:room_id', async (req, res) => {
  try {
    const messages = await require('../models/Message').find({ room_id: req.params.room_id }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 