const express = require('express');
const router = express.Router();
const userProfileController = require('../controllers/userProfileController');

// Get user profile
router.get('/:user_id', userProfileController.getUserProfile);

// Create or update user profile
router.post('/', userProfileController.createOrUpdateProfile);

// Update online status
router.put('/status', userProfileController.updateOnlineStatus);

// Get all users (for admin panel)
router.get('/', userProfileController.getAllUsers);

// Get unauthorized users
router.get('/unauthorized/list', userProfileController.getUnauthorizedUsers);

// Authorize user
router.put('/authorize/:user_id', userProfileController.authorizeUser);

// Assign user to admin
router.post('/assign', userProfileController.assignUserToAdmin);

// Get users by admin
router.get('/admin/:admin_id', userProfileController.getUsersByAdmin);

// Get user chat history
router.get('/:user_id/history', userProfileController.getUserChatHistory);

module.exports = router; 