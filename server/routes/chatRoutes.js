const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");
const auth = require("../middleware/authMiddleware");

// GET /api/chat/:requestId
router.get("/:requestId", auth, chatController.getMessages);

module.exports = router;