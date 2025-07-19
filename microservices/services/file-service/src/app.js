const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const { connectDB } = require('./config/database');
const fileRoutes = require('./routes/fileRoutes');
const errorHandler = require('../../../shared/middleware/errorHandler');

const app = express();
const port = process.env.PORT || 3006;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Connect to database
connectDB();

// Routes
app.use('/api/files', fileRoutes);
app.use('/api/v1/file-upload', fileRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'file-service',
        timestamp: new Date().toISOString()
    });
});

// Error handling
app.use(errorHandler);

app.listen(port, () => {
    console.log(`File service running on port ${port}`);
});

module.exports = app;
