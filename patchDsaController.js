const fs = require('fs');
const path = './server/src/controllers/dsaController.js';
let content = fs.readFileSync(path, 'utf8');

const { getDsaStatsForUser } = require('./server/src/services/dsaService');

content = content.replace(
  "const db = require('../config/db');",
  "const db = require('../config/db');\nconst { getDsaStatsForUser } = require('../services/dsaService');"
);

// Replace getStats
content = content.replace(
  /const getStats = async \(req, res\) => \{[\s\S]*?res\.status\(500\)\.json\(\{ message: 'Server error' \}\);\n  \}\n\};/m,
  `const getStats = async (req, res) => {
  try {
    const stats = await getDsaStatsForUser(req.user.id);
    res.json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};`
);

fs.writeFileSync(path, content);
console.log('Patched dsaController.js');
