const express = require('express');
const router = express.Router();
const topicController = require('../controllers/topicController');

// Get all active topics
router.get('/', topicController.getAllTopics);

// Create a new topic
router.post('/', topicController.createTopic);

// Assign topic to admin
router.post('/assign', topicController.assignTopicToAdmin);

// Remove topic assignment
router.delete('/assign', topicController.removeTopicAssignment);

// Get topics by admin
router.get('/admin/:admin_id', topicController.getTopicsByAdmin);

// Update topic
router.put('/:topic_id', topicController.updateTopic);

// Delete topic
router.delete('/:topic_id', topicController.deleteTopic);

module.exports = router; 