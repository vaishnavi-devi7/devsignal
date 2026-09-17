const jwt = require('jsonwebtoken');
const ErrorResponse = require('../utils/errorResponse');
const db = require('../config/db');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from DB
    const { rows } = await db.query('SELECT id, name, email FROM users WHERE id = $1', [decoded.id]);
    
    if (rows.length === 0) {
      return next(new ErrorResponse('User no longer exists', 401));
    }

    req.user = rows[0];
    next();
  } catch (err) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
};

module.exports = { protect };
