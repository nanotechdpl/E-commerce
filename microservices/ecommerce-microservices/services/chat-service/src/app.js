const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const { connectDB } = require('./config/database');
const chatRoutes = require('./routes/chatRoutes');
const socketHandler = require('./socket/socketHandler');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const port = process.env.PORT || 3005;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Connect to database
connectDB();

// Routes
app.use('/api/chat', chatRoutes);

// Socket.IO handling
socketHandler(io);

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'chat-service',
        timestamp: new Date().toISOString()
    });
});

// Error handling
app.use(errorHandler);

server.listen(port, () => {
    console.log(`Chat service running on port ${port}`);
});

module.exports = { app, server, io };