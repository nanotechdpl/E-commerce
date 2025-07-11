// routes/subscribeRoutes.js
const express = require('express');
const router = express.Router();
const subscribeController = require('../controller/subscribe.controller');
const isAdmin = require('../../../../../middlewares/isAdminMiddleWare');


// Create a new subscription
router.post('/', subscribeController.createSubscribe);

// Get all subscriptions (with optional date filtering)
router.get('/', subscribeController.getAllSubscriptions);

// Get a single subscription by ID
router.get('/:id', subscribeController.getSubscriptionById);

// Update a subscription by ID
router.put('/:id', isAdmin, subscribeController.updateSubscription);

// Delete a subscription by ID
router.delete('/:id', isAdmin, subscribeController.deleteSubscription);

module.exports = router;