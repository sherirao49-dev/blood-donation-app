const db = require("../db");

// 1. Create a Blood Request
exports.createRequest = async (req, res) => {
  const { patient_name, blood_type, hospital_name, city, description, urgency_level } = req.body;
  
  try {
    const newRequest = await db.query(
      `INSERT INTO blood_requests (requester_id, patient_name, blood_type, hospital_name, city, description, urgency_level) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [req.user.id, patient_name, blood_type, hospital_name, city, description, urgency_level]
    );

    res.json(newRequest.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// 2. Get ALL Requests (For the Feed)
exports.getAllRequests = async (req, res) => {
  try {
    // Join with users to show who is asking
    const requests = await db.query(
      `SELECT br.*, u.name as requester_name, u.email as requester_email 
       FROM blood_requests br
       JOIN users u ON br.requester_id = u.id
       ORDER BY br.created_at DESC`
    );
    res.json(requests.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};