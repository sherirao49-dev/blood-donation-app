const { Pool } = require('pg');
require('dotenv').config();

// Connect to your Neon PostgreSQL Database
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false, // Required for Neon
    },
});

// SQL Query to create the Messages table
const createMessagesTable = `
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    "requestId" VARCHAR(255) NOT NULL,
    "senderId" INTEGER, 
    "text" TEXT NOT NULL,
    "timestamp" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

const run = async () => {
    try {
        console.log("⏳ Connecting to Neon database...");
        await pool.query(createMessagesTable);
        console.log("✅ Table 'messages' created successfully!");
    } catch (err) {
        console.error("❌ Error creating table:", err);
    } finally {
        pool.end();
    }
};

run();