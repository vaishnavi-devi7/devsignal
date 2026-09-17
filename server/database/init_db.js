const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const initDB = async () => {
  try {
    console.log('Connecting to database...');
    
    // Read schema and seed files
    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql')).toString();
    const seedSql = fs.readFileSync(path.join(__dirname, 'seed.sql')).toString();

    console.log('Executing schema...');
    await pool.query(schemaSql);
    
    console.log('Executing seed data...');
    await pool.query(seedSql);

    console.log('Database initialized and seeded successfully!');
  } catch (err) {
    console.error('Error initializing database:', err);
  } finally {
    await pool.end();
  }
};

initDB();
