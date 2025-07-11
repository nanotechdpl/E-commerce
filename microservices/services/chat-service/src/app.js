const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();

const { connectDB } = require('./config/database');
const chatRoutes = require('./routes/chatRoutes');
const topicRoutes = require('./routes/topicRoutes');
const userProfileRoutes = require('./routes/userProfileRoutes');
const predefinedMessageRoutes = require('./routes/predefinedMessageRoutes');
const fileUploadRoutes = require('./routes/fileUploadRoutes');
const socketHandler = require('./socket/socketHandler');
const errorHandler = require('./middleware/errorHandler');
require('./jobs/chatLifecycle');

const app = express();
const server = http.createServer(app);
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:8080"
];
const io = socketIo(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"],
        credentials: true
    },
    transports: ['websocket', 'polling']
});

const port = process.env.PORT || 3005;

// Middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "frame-ancestors": [
          "'self'",
          "http://localhost:5173"
        ],
      },
    },
  })
);
// Use CORS globally
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  exposedHeaders: ['Content-Range', 'Accept-Ranges', 'Content-Length', 'Content-Type'],
}));
app.options('*', cors({
  origin: 'http://localhost:5173',
  credentials: true,
  exposedHeaders: ['Content-Range', 'Accept-Ranges', 'Content-Length', 'Content-Type'],
}));
app.use(express.json());

// Serve static files from uploads directory with CORS and range headers
app.use('/uploads', express.static(path.join(__dirname, '../uploads'), {
  setHeaders: (res) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Headers', 'Range');
    res.setHeader('Access-Control-Expose-Headers', 'Content-Range, Accept-Ranges, Content-Length, Content-Type');
    res.setHeader('Accept-Ranges', 'bytes');
  }
}));

// Connect to database
connectDB();

// Routes
app.use('/api/chat', chatRoutes);
app.use('/api/topics', topicRoutes);
app.use('/api/users', userProfileRoutes);
app.use('/api/predefined-messages', predefinedMessageRoutes);
app.use('/api/file-upload', fileUploadRoutes);

// Socket.IO handling
socketHandler(io);

io.engine.on("connection_error", (err) => {
    console.log("Socket.IO error:", err);
});

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