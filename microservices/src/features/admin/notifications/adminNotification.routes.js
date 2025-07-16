const express = require('express');
const router = express.Router();
const notificationController = require('./adminNotification.controller');
const isAdmin = require('../../../middlewares/isAdminMiddleWare');

// Create a new notification
router.post('/', isAdmin, notificationController.createNotification);

// Get all notifications (optionally filter by type, unread, etc.)
router.get('/', isAdmin, notificationController.getNotifications);

// Mark a notification as read
router.patch('/:id/read', isAdmin, notificationController.markAsRead);

module.exports = router; 