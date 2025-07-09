const express = require('express');
const router = express.Router();
const predefinedMessageController = require('../controllers/predefinedMessageController');

// Get predefined messages for admin
router.get('/admin/:admin_id', predefinedMessageController.getPredefinedMessages);

// Create predefined message
router.post('/', predefinedMessageController.createPredefinedMessage);

// Update predefined message
router.put('/:message_id', predefinedMessageController.updatePredefinedMessage);

// Delete predefined message
router.delete('/:message_id', predefinedMessageController.deletePredefinedMessage);

// Use predefined message
router.post('/:message_id/use', predefinedMessageController.usePredefinedMessage);

// Get most used messages
router.get('/admin/:admin_id/most-used', predefinedMessageController.getMostUsedMessages);

// Get messages by category
router.get('/admin/:admin_id/category/:category', predefinedMessageController.getMessagesByCategory);

// Get categories
router.get('/admin/:admin_id/categories', predefinedMessageController.getCategories);

module.exports = router; 