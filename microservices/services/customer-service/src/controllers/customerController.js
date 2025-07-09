const Customer = require('../models/Customer');
const jwt = require('jsonwebtoken');
const { redisClient } = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

class CustomerController {
    static async register(req, res) {
        try {
            const customer = await Customer.create(req.body);
            res.status(201).json({
                success: true,
                data: customer,
                message: 'Customer registered successfully'
            });
        } catch (error) {
            if (error.code === '23505') { // Unique violation
                return res.status(400).json({
                    success: false,
                    message: 'Email already exists'
                });
            }
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async login(req, res) {
        try {
            const { email, password } = req.body;
            const customer = await Customer.findByEmail(email);

            if (!customer || !await Customer.verifyPassword(password, customer.password)) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }

            const token = jwt.sign({ id: customer.id, email: customer.email }, JWT_SECRET, { expiresIn: '24h' });

            // Store session in Redis
            await redisClient.setEx(`session:${customer.id}`, 86400, token);

            res.json({
                success: true,
                data: {
                    customer: {
                        id: customer.id,
                        email: customer.email,
                        first_name: customer.first_name,
                        last_name: customer.last_name
                    },
                    token
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async getProfile(req, res) {
        try {
            const customer = await Customer.findById(req.user.id);
            if (!customer) {
                return res.status(404).json({
                    success: false,
                    message: 'Customer not found'
                });
            }

            res.json({
                success: true,
                data: customer
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async updateProfile(req, res) {
        try {
            const customer = await Customer.update(req.user.id, req.body);
            res.json({
                success: true,
                data: customer,
                message: 'Profile updated successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async logout(req, res) {
        try {
            await redisClient.del(`session:${req.user.id}`);
            res.json({
                success: true,
                message: 'Logged out successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
}

module.exports = CustomerController;