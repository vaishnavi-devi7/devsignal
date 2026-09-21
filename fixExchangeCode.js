const fs = require('fs');
const path = './server/src/controllers/githubController.js';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  "const token = generateToken(user_id);\n    res.json({ token });",
  `const token = generateToken(user_id);
    const userRes = await db.query('SELECT id, name, email FROM users WHERE id = $1', [user_id]);
    res.json({ token, user: userRes.rows[0] });`
);

fs.writeFileSync(path, content);
console.log('Fixed exchangeCode to return user');
