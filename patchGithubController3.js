const fs = require('fs');
const path = './server/src/controllers/githubController.js';
let content = fs.readFileSync(path, 'utf8');

// Replace JWT generation in githubCallback with one-time code
content = content.replace(
  /const token = generateToken\(devSignalUserId\);\n\n\s*res\.redirect\(`\$\{process\.env\.FRONTEND_URL\}\/login\?token=\$\{token\}`\);/g,
  `const crypto = require('crypto');
      const authCode = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins
      
      await db.query(
        'INSERT INTO oauth_codes (code, user_id, expires_at) VALUES ($1, $2, $3)',
        [authCode, devSignalUserId, expiresAt]
      );
      
      res.redirect(\`\${process.env.FRONTEND_URL}/login?code=\${authCode}\`);`
);

// Add exchangeCode endpoint
const exchangeEndpoint = `
// @desc    Exchange one-time auth code for JWT
// @route   POST /api/github/exchange-code
// @access  Public
const exchangeCode = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ message: 'Auth code is required' });

    const codeRes = await db.query(
      'SELECT user_id, expires_at FROM oauth_codes WHERE code = $1',
      [code]
    );

    if (codeRes.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid auth code' });
    }

    const { user_id, expires_at } = codeRes.rows[0];

    // Delete the code immediately so it can only be used once
    await db.query('DELETE FROM oauth_codes WHERE code = $1', [code]);

    if (new Date() > new Date(expires_at)) {
      return res.status(400).json({ message: 'Auth code expired' });
    }

    const token = generateToken(user_id);
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  loginGithub,
  connectGithub,
  githubCallback,
  getOverview,
  disconnectGithub,
  syncRepositories,
  exchangeCode
};
`;

content = content.replace(/module\.exports = \{[\s\S]*?\};/, exchangeEndpoint);

fs.writeFileSync(path, content);
console.log('Patched githubController.js for oauth codes');
