const fs = require('fs');
const path = './server/src/routes/githubRoutes.js';
let content = fs.readFileSync(path, 'utf8');

if (!content.includes('loginGithub')) {
  content = content.replace("authGithub,", "loginGithub,\n  authGithub,");
  content = content.replace("router.get('/auth', protect, authGithub);", "router.get('/login', loginGithub);\nrouter.get('/auth', protect, authGithub);");
}

fs.writeFileSync(path, content);
console.log('Patched routes');
