const fs = require('fs');
const path = './server/src/controllers/githubController.js';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/module\.exports = \{[\s\S]*?\};/, `module.exports = {
  loginGithub,
  authGithub,
  githubCallback,
  getStatus,
  disconnectGithub,
  syncGithub,
  getOverview,
  getRepositories,
  exchangeCode
};`);

fs.writeFileSync(path, content);
console.log('Fixed exports');
