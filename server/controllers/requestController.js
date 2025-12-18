const db = require("../db");

// 1. Get All Requests
exports.getAllRequests = async (req, res) => {
  try {
    // We select 'id' as '_id' so your frontend code (which looks for _id) works perfectly
    const result = await db.query('SELECT *, id as "_id" FROM requests ORDER BY date DESC');
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching requests:", err.message);
    res.status(500).json({ error: "Server Error" });
  }
};

// 2. Create a new Blood Request
exports.createRequest = async (req, res) => {
  try {
    const { patientName, bloodType, location, hospital, contactNumber, urgency } = req.body;
    
    // Using standard SQL to insert data
    // We assume your table columns are named exactly like this. 
    // If your table uses snake_case (e.g. patient_name), we might need to adjust this query.
    const query = `
      INSERT INTO requests ("patientName", "bloodType", "location", "hospital", "contactNumber", "urgency", "date", "status")
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), 'pending')
      RETURNING *, id as "_id";
    `;
    
    const values = [patientName, bloodType, location, hospital, contactNumber, urgency];
    
    const result = await db.query(query, values);
    res.json(result.rows[0]);

  } catch (err) {
    console.error("Error creating request:", err.message);
    res.status(500).json({ error: "Server Error" });
  }
};

// 3. ✅ DELETE REQUEST (Fixed for PostgreSQL)
exports.deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Simple SQL Delete command
    await db.query("DELETE FROM requests WHERE id = $1", [id]);
    
    res.json({ message: "Request deleted successfully" });
  } catch (err) {
    console.error("Error deleting request:", err.message);
    res.status(500).json({ error: "Server Error" });
  }
};