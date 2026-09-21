const fs = require('fs');
const path = './server/src/controllers/githubController.js';
let content = fs.readFileSync(path, 'utf8');

const oldBlock = `// Issue token and sync github data
      const token = generateToken(devsignalUserId);
      await syncGithubData(devsignalUserId, accessToken);
      
      return res.redirect(\`\${process.env.FRONTEND_URL}/login?token=\${token}\`);`;

const newBlock = `// Issue ONE-TIME OAuth code and sync github data
      await syncGithubData(devsignalUserId, accessToken);
      
      const crypto = require('crypto');
      const authCode = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins
      
      await db.query(
        'INSERT INTO oauth_codes (code, user_id, expires_at) VALUES ($1, $2, $3)',
        [authCode, devsignalUserId, expiresAt]
      );
      
      return res.redirect(\`\${process.env.FRONTEND_URL}/login?code=\${authCode}\`);`;

content = content.replace(oldBlock, newBlock);

fs.writeFileSync(path, content);
console.log('Fixed githubController.js callback');
