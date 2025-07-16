const express = require('express');
const PaymentController = require('../controllers/paymentController');
const router = express.Router();

router.post('/', PaymentController.createPayment);
router.get('/order/:order_id', PaymentController.getPaymentsByOrder);
router.patch('/:payment_id/status', PaymentController.updatePaymentStatus);

module.exports = router; 