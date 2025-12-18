const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { Server } = require("socket.io");
const http = require("http");
const db = require("./db"); // Imports our fixed DB connection

dotenv.config();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(express.json());
app.use(cors());

// Routes (✅ Keeping your existing routes active)
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/requests", require("./routes/requestRoutes"));
app.use("/api/chat", require("./routes/chatRoutes"));

// Socket.io Logic
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// ✅ NEW: Global list to track who is online
let onlineUsers = [];

io.on("connection", (socket) => {
  console.log(`Socket Connected: ${socket.id}`);

  // ✅ 1. NEW: Add User to Online List
  socket.on("add_user", (userId) => {
    // Only add if user is not already in the list
    if (userId && !onlineUsers.some((user) => user.userId === userId)) {
      onlineUsers.push({ userId, socketId: socket.id });
    }
    console.log("🟢 Online Users:", onlineUsers); // Debug log
    io.emit("get_users", onlineUsers); // Tell everyone who is online
  });

  // 2. Join Chat (Unchanged)
  socket.on("join_chat", (room) => {
    socket.join(room);
  });

  // 3. Send Message (Unchanged)
  socket.on("send_message", async (data) => {
    const { requestId, senderId, text } = data;
    try {
      await db.query(
        'INSERT INTO messages (requestid, senderid, text) VALUES ($1, $2, $3)',
        [requestId, senderId, text]
      );
      io.in(requestId).emit("receive_message", data);
    } catch (err) {
      console.error("Error saving message:", err);
    }
  });

  // ✅ 4. UPDATE: Remove user when they disconnect
  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    io.emit("get_users", onlineUsers); // Update the list for everyone else
    console.log("🔴 User Disconnected", socket.id);
  });
});

// Optional: DB Column Check (You can keep or remove this, it's just for debugging)
const dbCheck = require("./db");
// dbCheck.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'users'")
//   .then(res => console.log("✅ DB Connected"))
//   .catch(err => console.error("❌ DB Check Failed:", err.message));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});