const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");
const router = express.Router();

// 1. REGISTER
router.post("/register", async (req, res) => {
  const { name, email, password, bloodType } = req.body; // Frontend sends 'bloodType'
  try {
    const userCheck = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ✅ FIX: Using correct column 'blood_type'
    const newUser = await db.query(
      'INSERT INTO users (name, email, password, blood_type) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, hashedPassword, bloodType]
    );

    const token = jwt.sign({ id: newUser.rows[0].id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token, user: newUser.rows[0] });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ msg: "Server Error" });
  }
});

// 2. LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (user.rows.length === 0) return res.status(400).json({ msg: "Invalid Credentials" });

    const isMatch = await bcrypt.compare(password, user.rows[0].password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials" });

    const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token, user: user.rows[0] });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ msg: "Server Error" });
  }
});

// 3. GET USER INFO
router.get("/user", async (req, res) => {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // ✅ FIX: Using correct column 'blood_type'
    const user = await db.query('SELECT id, name, email, blood_type FROM users WHERE id = $1', [decoded.id]);
    
    // We send back 'bloodType' (camelCase) to keep frontend happy
    const userData = user.rows[0];
    res.json({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        bloodType: userData.blood_type // Map DB 'blood_type' -> Frontend 'bloodType'
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ msg: "Token is not valid" });
  }
});

// 4. UPDATE PROFILE
router.put("/profile", async (req, res) => {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

  const { name, email, bloodType } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // ✅ FIX: Using correct column 'blood_type' in SQL query
    const updatedUser = await db.query(
      'UPDATE users SET name = $1, email = $2, blood_type = $3 WHERE id = $4 RETURNING id, name, email, blood_type',
      [name, email, bloodType, userId]
    );

    if (updatedUser.rows.length === 0) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Map response back to camelCase for frontend
    const userData = updatedUser.rows[0];
    res.json({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        bloodType: userData.blood_type
    });

  } catch (err) {
    console.error("Profile Update Error:", err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;