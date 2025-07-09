const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { validateMessage, validateRoom } = require('../middleware/validation');
const Chat = require('../models/Chat');

// Message routes
router.post('/messages', validateMessage, chatController.sendMessage);
router.post('/admin/messages', validateMessage, chatController.sendAdminMessage); // New admin message route
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

// User management routes
router.post('/block-user', chatController.blockUser);
router.post('/unblock-user', chatController.unblockUser);
router.post('/toggle-permission', chatController.toggleUserPermission);
router.get('/blocked-users/:room_id', chatController.getBlockedUsers);
router.get('/user-permissions/:room_id/:user_id', chatController.getUserPermissions);

// Message forwarding routes
router.post('/forward-message', chatController.forwardMessage);
router.get('/forwarded-messages/:admin_id', chatController.getForwardedMessages);

// Assignment routes
router.get('/admin/assignments/:admin_id', chatController.getAdminAssignments);
router.get('/rooms/:room_id/assignment', chatController.getRoomAssignment);

// Debug routes (temporary)
router.get('/debug/room/:room_id/messages', chatController.getRoomMessagesDebug);
router.post('/debug/admin-reply/:room_id', chatController.forceAdminReply);

module.exports = router;
