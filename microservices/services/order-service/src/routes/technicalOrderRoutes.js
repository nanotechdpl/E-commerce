const express = require('express');
const TechnicalOrderController = require('../controllers/technicalOrderController');
const router = express.Router();

router.post('/', TechnicalOrderController.create);
router.get('/:order_id', TechnicalOrderController.getByOrderId);

module.exports = router; 