const express = require('express');
const router = express.Router();
const trafficController = require('./traffic.controller');
const isAdmin = require('../../../middlewares/isAdminMiddleWare');

// Log a traffic event
router.post('/log', trafficController.logTraffic);

// Get stats (admin only)
router.get('/stats/device', isAdmin, trafficController.getStatsByDevice);
router.get('/stats/location', isAdmin, trafficController.getStatsByLocation);
router.get('/stats/visitor-history', isAdmin, trafficController.getVisitorHistory);

module.exports = router; 