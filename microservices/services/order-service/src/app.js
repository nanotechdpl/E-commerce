const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const { connectDB } = require('./config/database');

const orderRoutes = require('./routes/order.routes');
const errorHandler = require('../../../shared/middleware/errorHandler');

const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const communicationRoutes = require('./routes/communicationRoutes');
const technicalOrderRoutes = require('./routes/technicalOrderRoutes');
const fileUploadRoutes = require('./routes/fileUploadRoutes');
const errorHandler = require('./middleware/errorHandler');
const { authenticate } = require('./middleware/auth');


const app = express();
const port = process.env.PORT || 3003;


// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Connect to database
connectDB();

// Routes
app.use('/api/orders', orderRoutes);

// Health check

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use('/api/users', userRoutes);
app.use('/api/orders', authenticate, orderRoutes);
app.use('/api/payments', authenticate, paymentRoutes);
app.use('/api/communications', authenticate, communicationRoutes);
app.use('/api/technical-orders', authenticate, technicalOrderRoutes);
app.use('/api/files', authenticate, fileUploadRoutes);

app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'order-service',
        timestamp: new Date().toISOString()
    });
});


app.use(errorHandler);

app.listen(port, () => {
    console.log(`Order service running on port ${port}`);
});

module.exports = app;
