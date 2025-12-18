const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

const run = async () => {
    try {
        console.log("⏳ Fixing Database...");
        
        // 1. Delete the old, broken table
        await pool.query('DROP TABLE IF EXISTS messages');
        console.log("🗑️ Old broken table deleted.");

        // 2. Create a new, clean table (All lowercase to prevent errors)
        const createQuery = `
            CREATE TABLE messages (
                id SERIAL PRIMARY KEY,
                requestid VARCHAR(255) NOT NULL,
                senderid INTEGER,
                text TEXT NOT NULL,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
        await pool.query(createQuery);
        console.log("✅ New 'messages' table created successfully!");
    } catch (err) {
        console.error("❌ Error:", err);
    } finally {
        pool.end();
    }
};

run();