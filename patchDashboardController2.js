const fs = require('fs');
const path = './server/src/controllers/dashboardController.js';
let content = fs.readFileSync(path, 'utf8');

content = "const db = require('../config/db');\n" +
"const { getDsaStatsForUser } = require('../services/dsaService');\n" +
"const { getGithubOverviewForUser } = require('../services/githubService2');\n\n" +
"const getDashboard = async (req, res) => {\n" +
"  try {\n" +
"    const profileRes = await db.query('SELECT bio, location, skills FROM user_profiles WHERE user_id = $1', [req.user.id]);\n" +
"    const resumeRes = await db.query('SELECT id, file_name, file_url, parsed_data, status, created_at, updated_at FROM resumes WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1', [req.user.id]);\n" +
"    \n" +
"    res.status(200).json({\n" +
"      user: req.user,\n" +
"      profile: profileRes.rows[0] || {},\n" +
"      githubStats: await getGithubOverviewForUser(req.user.id),\n" +
"      dsaStats: await getDsaStatsForUser(req.user.id),\n" +
"      resumeData: resumeRes.rows[0] || null,\n" +
"      resumeScore: null,\n" +
"      jobMatchScore: null\n" +
"    });\n" +
"  } catch (error) {\n" +
"    console.error(error);\n" +
"    res.status(500).json({ message: 'Server error' });\n" +
"  }\n" +
"};\n\n" +
"module.exports = { getDashboard };";

fs.writeFileSync(path, content);
console.log('Patched dashboardController.js 2');
