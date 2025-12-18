const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false, // Required for Neon
    },
});

const createTableQuery = `
CREATE TABLE IF NOT EXISTS requests (
    id SERIAL PRIMARY KEY,
    "patientName" VARCHAR(255) NOT NULL,
    "bloodType" VARCHAR(10) NOT NULL,
    "location" VARCHAR(255) NOT NULL,
    "hospital" VARCHAR(255),
    "contactNumber" VARCHAR(50),
    "urgency" VARCHAR(50),
    "status" VARCHAR(50) DEFAULT 'pending',
    "date" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    requester INTEGER 
);
`;

const run = async () => {
    try {
        console.log("⏳ Connecting to database...");
        await pool.query(createTableQuery);
        console.log("✅ Table 'requests' created successfully!");
    } catch (err) {
        console.error("❌ Error creating table:", err);
    } finally {
        pool.end();
    }
};

run();