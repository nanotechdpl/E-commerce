const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { validateMessage, validateRoom } = require('../middleware/validation');

// Message routes
router.post('/messages', validateMessage, chatController.sendMessage);
router.get('/messages/:roomId', chatController.getMessages);
router.put('/messages/:messageId', chatController.editMessage);
router.delete('/messages/:messageId', chatController.deleteMessage);
router.patch('/messages/:messageId/read', chatController.markAsRead);

// Room routes
router.post('/rooms', validateRoom, chatController.createRoom);
router.get('/rooms/user/:userId', chatController.getUserRooms);
router.get('/rooms/:roomId', chatController.getRoomDetails);
router.post('/rooms/:roomId/join', chatController.joinRoom);
router.post('/rooms/:roomId/leave', chatController.leaveRoom);
router.put('/rooms/:roomId', chatController.updateRoom);

// Utility routes
router.get('/rooms/:roomId/participants', chatController.getRoomParticipants);
router.get('/messages/unread/:userId', chatController.getUnreadMessages);

module.exports = router;
