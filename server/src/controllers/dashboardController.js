const db = require('../config/db');
const { getDsaStatsForUser } = require('../services/dsaService');
const { getGithubOverviewForUser } = require('../services/githubService2');

const getDashboard = async (req, res) => {
  try {
    const profileRes = await db.query('SELECT bio, location, skills FROM user_profiles WHERE user_id = $1', [req.user.id]);
    const resumeRes = await db.query('SELECT id, file_name, file_type, full_name, email, phone, location, skills, programming_languages, frameworks, databases, tools, education, experience, projects, certifications, updated_at FROM resume_profiles WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1', [req.user.id]);
    
    res.status(200).json({
      user: req.user,
      profile: profileRes.rows[0] || {},
      githubStats: await getGithubOverviewForUser(req.user.id),
      dsaStats: await getDsaStatsForUser(req.user.id),
      resumeData: resumeRes.rows[0] || null,
      resumeScore: null,
      jobMatchScore: null
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getDashboard };