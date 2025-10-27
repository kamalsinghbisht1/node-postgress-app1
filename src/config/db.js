// db.js - PostgreSQL connection using pg Pool
const { Pool } = require('pg');
require('dotenv').config(); // make sure .env variables load

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false } // Uncomment only if using hosted DBs (like Render, Neon, etc.)
});

// ✅ Test connection once on startup
pool.connect()
  .then(() => {
    console.log('✅ Connected to PostgreSQL Database successfully');
  })
  .catch((err) => {
    console.error('❌ Database connection error:', err.message);
  });

module.exports = pool;








