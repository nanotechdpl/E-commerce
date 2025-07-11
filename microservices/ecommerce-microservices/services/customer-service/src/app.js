const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const { connectDB, connectRedis } = require('./config/database');
const customerRoutes = require('./routes/customerRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Connect to databases
connectDB();
connectRedis();

// Routes
app.use('/api/customers', customerRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'customer-service',
        timestamp: new Date().toISOString()
    });
});

// Error handling
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Customer service running on port ${port}`);
});

module.exports = app;