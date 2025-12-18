const express = require("express");
const router = express.Router();
const requestController = require("../controllers/requestController"); // Points to your NEW SQL controller
const auth = require("../middleware/authMiddleware");

// POST /api/requests (Protected)
router.post("/", auth, requestController.createRequest);

// GET /api/requests (Public)
router.get("/", requestController.getAllRequests);

// DELETE /api/requests/:id (Protected)
router.delete("/:id", auth, requestController.deleteRequest);

module.exports = router;