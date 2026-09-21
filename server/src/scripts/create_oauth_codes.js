const db = require('../config/db');
require('dotenv').config({ path: '../../.env' }); // load db url

async function up() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS oauth_codes (
      id SERIAL PRIMARY KEY,
      code VARCHAR(100) UNIQUE NOT NULL,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log('oauth_codes table created');
  process.exit(0);
}

up().catch(err => { console.error(err); process.exit(1); });
