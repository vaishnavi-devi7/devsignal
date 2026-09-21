const fs = require('fs');
const path = './frontend/src/lib/api.js';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  "getTopics: () => api.get('/dsa/topics')",
  "getTopics: () => api.get('/dsa/topics'),\n  syncCodeforces: (username) => api.post('/dsa/sync/codeforces', { username })"
);

fs.writeFileSync(path, content);
console.log('Patched api.js');
