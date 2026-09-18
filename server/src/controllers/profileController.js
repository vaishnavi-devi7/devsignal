const db = require('../config/db');

// @desc    Get user profile
// @route   GET /api/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT bio, location, skills, education, experience FROM user_profiles WHERE user_id = $1',
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/profile
// @access  Private
const updateProfile = async (req, res) => {
  const { bio, location, skills, education, experience } = req.body;

  try {
    const { rows } = await db.query(
      `UPDATE user_profiles 
       SET bio = COALESCE($1, bio), 
           location = COALESCE($2, location), 
           skills = COALESCE($3, skills), 
           education = COALESCE($4, education), 
           experience = COALESCE($5, experience),
           updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $6 RETURNING bio, location, skills, education, experience`,
      [bio, location, skills, education, experience, req.user.id]
    );

    if (rows.length === 0) {
      // Create if it doesn't exist
      const insert = await db.query(
        `INSERT INTO user_profiles (user_id, bio, location, skills, education, experience)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING bio, location, skills, education, experience`,
        [req.user.id, bio, location, skills, education, experience]
      );
      return res.status(200).json(insert.rows[0]);
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getProfile,
  updateProfile,
};
