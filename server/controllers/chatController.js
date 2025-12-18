const db = require("../db");

exports.getMessages = async (req, res) => {
  try {
    const { requestId } = req.params;
    
    // ✅ FIXED: Using lowercase 'requestid' to match the new table
    const result = await db.query(
      'SELECT * FROM messages WHERE requestid = $1 ORDER BY timestamp ASC',
      [requestId]
    );
    
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ error: "Server Error" });
  }
};