const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { Server } = require("socket.io"); // Import Socket.io
const http = require("http"); // Import HTTP module

const app = express();
const server = http.createServer(app); // Wrap Express in HTTP server

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/requests", require("./routes/requestRoutes"));
app.use("/api/ai", require("./routes/aiRoutes"));

// --- SOCKET.IO CHAT LOGIC ---
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Allow your Frontend to connect
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  // 1. Join Room & Track Online Users
  socket.on("join_room", (room) => {
    socket.join(room);
    
    // Count users in room for "Online" status
    const clients = io.sockets.adapter.rooms.get(room);
    const numClients = clients ? clients.size : 0;
    
    // Send count to everyone in the room
    io.in(room).emit("room_users", numClients);
  });

  // 2. Typing Indicators
  socket.on("typing", (room) => {
    socket.to(room).emit("display_typing");
  });

  socket.on("stop_typing", (room) => {
    socket.to(room).emit("hide_typing");
  });

  // 3. Send Message
  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  // 4. NEW: Message Seen (Blue Ticks)
  socket.on("message_seen", (data) => {
    // Tell the sender that their message was seen
    socket.to(data.room).emit("message_marked_seen"); 
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

// START SERVER
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));