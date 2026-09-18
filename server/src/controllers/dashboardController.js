const db = require('../config/db');

// @desc    Get dashboard data
// @route   GET /api/dashboard
// @access  Private
const getDashboard = async (req, res) => {
  try {
    const profileRes = await db.query(
      'SELECT bio, location, skills FROM user_profiles WHERE user_id = $1',
      [req.user.id]
    );

    res.status(200).json({
      user: req.user,
      profile: profileRes.rows[0] || {},
      // Do NOT invent stats per requirements, just return empty data 
      githubStats: null,
      dsaStats: null,
      resumeScore: null,
      jobMatchScore: null
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getDashboard,
};
