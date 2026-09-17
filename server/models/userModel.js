const db = require('../config/db');
const bcrypt = require('bcryptjs');

class UserModel {

  static async findByEmail(email) {
    const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    return rows[0];
  }

  static async findById(id) {
    const { rows } = await db.query('SELECT id, name, email, created_at FROM users WHERE id = $1', [id]);
    return rows[0];
  }

  static async create(name, email, password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const query = `
      INSERT INTO users (name, email, password)
      VALUES ($1, $2, $3)
      RETURNING id, name, email;
    `;
    
    const { rows } = await db.query(query, [name, email, hashedPassword]);
    return rows[0];
  }

  static async matchPassword(enteredPassword, storedPassword) {
    return await bcrypt.compare(enteredPassword, storedPassword);
  }
}

module.exports = UserModel;
