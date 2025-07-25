const express = require('express');
const PaymentController = require('../controllers/paymentController');
// Dummy validation middleware
const dummyValidate = (req, res, next) => next();

const router = express.Router();

// Payment routes
router.post('/create-order', dummyValidate, PaymentController.createOrder);
router.post('/capture-order', dummyValidate, PaymentController.captureOrder);
router.post('/prepare', PaymentController.preparePayment);
router.get('/:payment_id', PaymentController.getPayment);
router.get('/order/:order_id', PaymentController.getOrderPayments);
router.get('/customer/:customer_id', PaymentController.getCustomerPayments);
router.get('/paypal-order/:paypal_order_id', PaymentController.getOrderDetails);

// Refund routes
router.post('/refund', dummyValidate, PaymentController.createRefund);

// Webhook route
router.post('/webhook', PaymentController.webhookHandler);

// (Optional) Keep mock endpoint for dev only
// router.get('/mock-list', ...);

module.exports = router;
