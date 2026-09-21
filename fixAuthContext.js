const fs = require('fs');
const path = './frontend/src/contexts/AuthContext.jsx';
let content = fs.readFileSync(path, 'utf8');

// Use the existing `api` instance which is already imported and configured
content = content.replace(
  /const res = await axios\.post\(`\$\{process\.env\.VITE_API_URL \|\| 'http:\/\/localhost:5005\/api'\}\/github\/exchange-code`, \{ code \}\);/,
  "const res = await api.post('/github/exchange-code', { code });"
);

fs.writeFileSync(path, content);
console.log('Fixed AuthContext.jsx');
