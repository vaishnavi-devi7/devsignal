const fs = require('fs');
const path = './server/src/controllers/githubController.js';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  "const { syncGithubData } = require('../services/githubSyncService');",
  "const { syncGithubData } = require('../services/githubSyncService');\nconst { getGithubOverviewForUser } = require('../services/githubService2');"
);

content = content.replace(
  /const getOverview = async \(req, res\) => \{[\s\S]*?res\.status\(500\)\.json\(\{ message: 'Server error' \}\);\n  \}\n\};/m,
  `const getOverview = async (req, res) => {
  try {
    const overview = await getGithubOverviewForUser(req.user.id);
    res.json(overview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};`
);

fs.writeFileSync(path, content);
console.log('Patched githubController.js');
