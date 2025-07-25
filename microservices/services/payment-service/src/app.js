const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const { connectDB } = require('./config/database');
const paymentRoutes = require('./routes/paymentRoutes');
const errorHandler = require('../../../shared/middleware/errorHandler');

const app = express();
const port = process.env.PORT || 3004;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Connect to database (allow server to run even if DB connection fails)
(async () => {
  try {
    await connectDB();
  } catch (err) {
    console.error('Database connection failed, continuing in mock/test mode:', err.message);
  }
})();

// Routes
app.use('/api/payments', paymentRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'payment-service',
        timestamp: new Date().toISOString()
    });
});

// Error handling
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Payment service running on port ${port}`);
});

module.exports = app;