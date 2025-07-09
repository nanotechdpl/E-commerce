require("dotenv").config();
const express = require("express");

const http = require("http");
const cors = require("cors");
const cookieParser = require("cookie-parser"); // Import cookie-parser
const path = require("path");

const connectDB = require("./config/connectdb");
const routes = require("./routes/routes");

const { chatuser } = require("./features/websocket/customer/chat.socket");

// dotenv.config({ path: ".env" });

const app = express();
const PORT = process.env.PORT || 7000; // Set a backend port

connectDB();

const server = http.Server(app);
const io = require("socket.io")(server, {
  pingInterval: 15000,
  pingTimeout: 30000,
  cors: {
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:4000",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:4000",
  "http://localhost:7000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// server health check
app.get("/", (req, res) => {
  res.send("Server is running");
});
app.use("/api/v1", routes);
app.use("/uploads", express.static("uploads"));

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });

  socket.on("chat message", (message) => {
    console.log("Message received: " + message);
    io.emit("chat message", message); // Forward to all clients
  });
});

chatuser(io);
