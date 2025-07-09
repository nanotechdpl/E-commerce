const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const { connectRedis } = require('./config/redis');
const cacheRoutes = require('./routes/cache.routes');
const errorHandler = require('../../../shared/middleware/errorHandler');

const app = express();
const port = process.env.PORT || 3002;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Connect to Redis
connectRedis();

// Routes
app.use('/api/cache', cacheRoutes);

// Health check
app.get('/health', async (req, res) => {
    const { redisClient } = require('./config/redis');

    try {
        await redisClient.ping();
        res.json({
            status: 'healthy',
            service: 'cache-service',
            redis: 'connected',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Redis connection error:', error);
        res.status(503).json({
            status: 'unhealthy',
            service: 'cache-service',
            redis: 'disconnected',
            timestamp: new Date().toISOString()
        });
    }
});

// Error handling
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Cache service running on port ${port}`);
});

module.exports = app;