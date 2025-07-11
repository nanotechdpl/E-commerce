const express = require('express');
const PaymentController = require('../controllers/paymentController');
const validate = require('../middleware/validation');

const router = express.Router();

// Payment routes
router.post('/create-order', validate.createOrder, PaymentController.createOrder);
router.post('/capture-order', validate.captureOrder, PaymentController.captureOrder);
router.post('/prepare', PaymentController.preparePayment);
router.get('/:payment_id', PaymentController.getPayment);
router.get('/order/:order_id', PaymentController.getOrderPayments);
router.get('/customer/:customer_id', PaymentController.getCustomerPayments);
router.get('/paypal-order/:paypal_order_id', PaymentController.getOrderDetails);

// Refund routes
router.post('/refund', validate.createRefund, PaymentController.createRefund);

// Webhook route
router.post('/webhook', PaymentController.webhookHandler);

module.exports = router;
