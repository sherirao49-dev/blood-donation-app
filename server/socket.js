const socketIo = require("socket.io");
const db = require("./db");

let io;
const onlineUsers = new Map(); // { userId: socketId }

exports.init = (server) => {
  io = socketIo(server, {
    cors: {
      origin: "*", 
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("⚡ New Socket Connection:", socket.id);

    // 1. Join
    socket.on("join", (userId) => {
      onlineUsers.set(userId, socket.id);
      io.emit("user_online", userId);
    });

    // 2. Message
    socket.on("send_message", async (data) => {
      const { senderId, receiverId, content } = data;
      try {
        const savedMsg = await db.query(
          "INSERT INTO messages (sender_id, receiver_id, content) VALUES ($1, $2, $3) RETURNING *",
          [senderId, receiverId, content]
        );
        const receiverSocketId = onlineUsers.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("receive_message", savedMsg.rows[0]);
        }
      } catch (err) {
        console.error(err);
      }
    });

    // 3. Typing
    socket.on("typing", (data) => {
      const receiverSocketId = onlineUsers.get(data.receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("user_typing", { senderId: data.senderId });
      }
    });

    // 4. Disconnect
    socket.on("disconnect", () => {
      for (let [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          io.emit("user_offline", userId);
          break;
        }
      }
    });
  });
};