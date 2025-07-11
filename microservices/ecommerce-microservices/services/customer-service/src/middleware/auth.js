const jwt = require('jsonwebtoken');
const { redisClient } = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        // Check if session exists in Redis
        const session = await redisClient.get(`session:${decoded.id}`);
        if (!session) {
            return res.status(401).json({
                success: false,
                message: 'Invalid session'
            });
        }

        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }
};

module.exports = authMiddleware;
