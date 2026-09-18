const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function initDB() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL
  });

  try {
    const schema = fs.readFileSync(path.join(__dirname, '../schema.sql'), 'utf8');
    await pool.query(schema);
    console.log('Database initialized successfully.');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await pool.end();
  }
}

initDB();
