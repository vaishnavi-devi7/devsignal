const fs = require('fs');
const path = './server/src/controllers/dashboardController.js';
let content = fs.readFileSync(path, 'utf8');

const { getDsaStatsForUser } = require('./server/src/services/dsaService');

content = content.replace(
  "const db = require('../config/db');",
  "const db = require('../config/db');\nconst { getDsaStatsForUser } = require('../services/dsaService');"
);

content = content.replace(
  "dsaStats: null,",
  "dsaStats: await getDsaStatsForUser(req.user.id),"
);

fs.writeFileSync(path, content);
console.log('Patched dashboardController.js');
