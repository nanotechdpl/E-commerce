const Order = require('../models/Order');
const Product = require('../models/Product');
const axios = require('axios');

class OrderController {
    static async createOrder(req, res) {
        try {
            const order = await Order.create(req.body);

            // Notify payment service (optional)
            try {
                await axios.post('http://payment-service:3004/api/payments/prepare', {
                    order_id: order.id,
                    amount: order.total_amount,
                    customer_id: order.customer_id
                });
            } catch (error) {
                console.log('Payment service notification failed:', error.message);
            }

            res.status(201).json({
                success: true,
                data: order,
                message: 'Order created successfully'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static async getOrder(req, res) {
        try {
            const order = await Order.findById(req.params.id);

            if (!order) {
                return res.status(404).json({
                    success: false,
                    message: 'Order not found'
                });
            }

            res.json({
                success: true,
                data: order
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async getCustomerOrders(req, res) {
        try {
            const { customer_id } = req.params;
            const { page = 1, limit = 10 } = req.query;
            const offset = (page - 1) * limit;

            const orders = await Order.findByCustomerId(customer_id, parseInt(limit), offset);

            res.json({
                success: true,
                data: orders,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit)
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async updateOrderStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            const order = await Order.updateStatus(id, status);

            if (!order) {
                return res.status(404).json({
                    success: false,
                    message: 'Order not found'
                });
            }

            res.json({
                success: true,
                data: order,
                message: 'Order status updated successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async getAllOrders(req, res) {
        try {
            const { page = 1, limit = 10 } = req.query;
            const offset = (page - 1) * limit;

            const orders = await Order.getAll(parseInt(limit), offset);

            res.json({
                success: true,
                data: orders,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit)
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async getProducts(req, res) {
        try {
            const { page = 1, limit = 20, search } = req.query;
            const offset = (page - 1) * limit;

            let products;
            if (search) {
                products = await Product.search(search, parseInt(limit), offset);
            } else {
                products = await Product.getAll(parseInt(limit), offset);
            }

            res.json({
                success: true,
                data: products,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit)
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async getProduct(req, res) {
        try {
            const product = await Product.findById(req.params.id);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found'
                });
            }

            res.json({
                success: true,
                data: product
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
}

module.exports = OrderController;