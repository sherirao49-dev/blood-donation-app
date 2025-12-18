const { Pool } = require("pg");
require("dotenv").config();

// check if the .env file is loaded
if (!process.env.DATABASE_URL) {
  console.error("❌ ERROR: DATABASE_URL is missing! Check your .env file.");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Neon
  },
});

// Simple connection test on startup
pool.connect()
  .then(() => console.log("✅ Database Connected Successfully!"))
  .catch((err) => console.error("❌ Database Connection Failed:", err.message));

module.exports = {
  query: (text, params) => pool.query(text, params),
};