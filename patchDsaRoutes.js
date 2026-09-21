const fs = require('fs');
const path = './server/src/routes/dsaRoutes.js';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  "const { protect } = require('../middleware/authMiddleware');",
  "const { protect } = require('../middleware/authMiddleware');\nconst { syncCodeforces } = require('../controllers/dsaSyncController');"
);

content += "\nrouter.post('/sync/codeforces', protect, syncCodeforces);\n";

fs.writeFileSync(path, content);
console.log('Patched dsaRoutes.js');
