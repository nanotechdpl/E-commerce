const express = require('express');
const CommunicationController = require('../controllers/communicationController');
const router = express.Router();

router.post('/', CommunicationController.addMessage);
router.get('/:order_id', CommunicationController.getMessages);

module.exports = router; 