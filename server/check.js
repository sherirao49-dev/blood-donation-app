const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function checkColumns() {
  console.log("🕵️‍♂️ Investigating Database...");
  try {
    // Ask the database for the list of columns in the 'users' table
    const res = await pool.query(
      "SELECT column_name FROM information_schema.columns WHERE table_name = 'users'"
    );
    
    console.log("✅ FOUND THESE COLUMNS:");
    res.rows.forEach(row => {
        console.log(`   - ${row.column_name}`);
    });
    
  } catch (err) {
    console.error("❌ Error checking database:", err.message);
  } finally {
    pool.end();
  }
}

checkColumns();