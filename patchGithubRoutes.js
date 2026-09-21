const fs = require('fs');
const path = './server/src/routes/githubRoutes.js';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  "disconnectGithub,\n  syncRepositories",
  "disconnectGithub,\n  syncRepositories,\n  exchangeCode"
);
content = content.replace(
  "router.post('/sync', protect, syncRepositories);",
  "router.post('/sync', protect, syncRepositories);\nrouter.post('/exchange-code', exchangeCode);"
);

fs.writeFileSync(path, content);
console.log('Patched githubRoutes.js');
