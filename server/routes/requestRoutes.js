const express = require("express");
const router = express.Router();
const requestController = require("../controllers/requestController");
const auth = require("../middleware/authMiddleware");

// POST /api/requests (Protected: Needs Token)
router.post("/", auth, requestController.createRequest);

// GET /api/requests (Public: Anyone can see)
router.get("/", requestController.getAllRequests);

module.exports = router;