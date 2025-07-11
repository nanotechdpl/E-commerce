const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const { connectDB } = require('./config/database');
const orderRoutes = require('./routes/orderRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const port = process.env.PORT || 3007;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Connect to database
connectDB();

// Routes
app.use('/api/orders', orderRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'order-service-prisma',
        timestamp: new Date().toISOString()
    });
});

// Error handling
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Order service running on port ${port}`);
});

module.exports = app;
