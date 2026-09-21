const fs = require('fs');
const path = './server/src/routes/githubRoutes.js';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  "getRepositories \n}",
  "getRepositories,\n  exchangeCode\n}"
);

content = content.replace(
  "router.get('/repositories', protect, getRepositories);",
  "router.get('/repositories', protect, getRepositories);\nrouter.post('/exchange-code', exchangeCode);"
);

fs.writeFileSync(path, content);
