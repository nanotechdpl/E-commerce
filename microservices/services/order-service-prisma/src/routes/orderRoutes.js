const express = require('express');
const OrderController = require('../controllers/orderController');
const validate = require('../middleware/validation');

const router = express.Router();

// Order routes
router.post('/', validate.createOrder, OrderController.createOrder);
router.get('/', OrderController.getAllOrders);
router.get('/:id', OrderController.getOrder);
router.patch('/:id/status', validate.updateOrderStatus, OrderController.updateOrderStatus);
router.get('/customer/:customer_id', OrderController.getCustomerOrders);

// Product routes
router.get('/products/all', OrderController.getProducts);
router.get('/products/:id', OrderController.getProduct);

module.exports = router;