const fs = require('fs');
const path = './server/src/controllers/githubController.js';
let content = fs.readFileSync(path, 'utf8');

// Add imports
if (!content.includes('generateToken')) {
  content = content.replace("const { generateOAuthState } = require('../utils/crypto');", 
    "const { generateOAuthState } = require('../utils/crypto');\nconst generateToken = require('../utils/generateToken');\nconst crypto = require('crypto');\nconst bcrypt = require('bcryptjs');");
}

// Add loginGithub
const loginGithubStr = `
// @desc    Initiate GitHub OAuth for Login/Signup
// @route   GET /api/github/login
// @access  Public
const loginGithub = async (req, res) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const redirectUri = process.env.GITHUB_CALLBACK_URL;
  
  const state = generateOAuthState();
  
  try {
    await db.query(
      "INSERT INTO oauth_states (state, user_id, expires_at) VALUES ($1, NULL, CURRENT_TIMESTAMP + INTERVAL '10 minutes')",
      [state]
    );
  } catch (error) {
    console.error('State generation error:', error);
    return res.status(500).json({ message: 'Failed to initiate OAuth flow' });
  }
  
  // Use user:email scope to get email
  const githubAuthUrl = \`https://github.com/login/oauth/authorize?client_id=\${clientId}&redirect_uri=\${redirectUri}&scope=read:user,user:email&state=\${state}\`;
  
  res.json({ url: githubAuthUrl });
};
`;

if (!content.includes('const loginGithub')) {
  content = content.replace("const authGithub = async (req, res) => {", loginGithubStr + "\nconst authGithub = async (req, res) => {");
}

// Update callback
const newCallback = `const githubCallback = async (req, res) => {
  const { code, state } = req.query;
  
  if (!code || !state) {
    return res.redirect(\`\${process.env.FRONTEND_URL}/login?error=invalid_request\`);
  }

  try {
    const stateRes = await db.query(
      "SELECT user_id FROM oauth_states WHERE state = $1 AND expires_at > CURRENT_TIMESTAMP",
      [state]
    );
    
    if (stateRes.rows.length === 0) {
      return res.redirect(\`\${process.env.FRONTEND_URL}/login?error=invalid_state\`);
    }
    
    const userId = stateRes.rows[0].user_id; // null if login flow
    await db.query("DELETE FROM oauth_states WHERE state = $1", [state]);

    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: process.env.GITHUB_CALLBACK_URL,
      },
      { headers: { Accept: 'application/json' } }
    );

    const accessToken = tokenResponse.data.access_token;
    if (!accessToken) {
      return res.redirect(\`\${process.env.FRONTEND_URL}/login?error=oauth_failed\`);
    }

    if (userId) {
      // Connect Flow
      await syncGithubData(userId, accessToken);
      return res.redirect(\`\${process.env.FRONTEND_URL}/github\`);
    } else {
      // Login/Signup Flow
      const userRes = await axios.get('https://api.github.com/user', {
        headers: { Authorization: \`Bearer \${accessToken}\` }
      });
      const githubUser = userRes.data;
      
      let email = githubUser.email;
      if (!email) {
        const emailRes = await axios.get('https://api.github.com/user/emails', {
          headers: { Authorization: \`Bearer \${accessToken}\` }
        });
        const primaryEmail = emailRes.data.find(e => e.primary && e.verified) || emailRes.data.find(e => e.verified) || emailRes.data[0];
        email = primaryEmail ? primaryEmail.email : null;
      }
      
      if (!email) {
        return res.redirect(\`\${process.env.FRONTEND_URL}/login?error=no_email\`);
      }

      // Check if devsignal user exists by email
      let devsignalUserId;
      let devsignalUserResult = await db.query('SELECT id, name, email FROM users WHERE email = $1', [email]);
      
      if (devsignalUserResult.rows.length > 0) {
        devsignalUserId = devsignalUserResult.rows[0].id;
      } else {
        // Create new user
        const randomPassword = crypto.randomBytes(32).toString('hex');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(randomPassword, salt);
        const newName = githubUser.name || githubUser.login;
        
        const newUserRes = await db.query(
          'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email',
          [newName, email, hashedPassword]
        );
        devsignalUserId = newUserRes.rows[0].id;
        await db.query('INSERT INTO user_profiles (user_id) VALUES ($1)', [devsignalUserId]);
      }
      
      // Issue token and sync github data
      const token = generateToken(devsignalUserId);
      await syncGithubData(devsignalUserId, accessToken);
      
      // Redirect to frontend with token
      return res.redirect(\`\${process.env.FRONTEND_URL}/login?token=\${token}\`);
    }

  } catch (error) {
    console.error('GitHub Callback Error:', error.message);
    res.redirect(\`\${process.env.FRONTEND_URL}/login?error=server_error\`);
  }
};`;

content = content.replace(/const githubCallback = async.*?res\.status\(500\)\.json\({ message: 'Server error' }\);\n\s*\}\n\};\n\n\/\/ @desc/s, 
  newCallback + "\n\n// @desc    Check GitHub connection status\n// @route   GET /api/github/status\n// @access  Private\nconst getStatus = async (req, res) => {\n  try {\n    const { rows } = await db.query('SELECT github_username, updated_at FROM github_accounts WHERE user_id = $1', [req.user.id]);\n    if (rows.length > 0) {\n      res.json({ connected: true, username: rows[0].github_username, lastSynced: rows[0].updated_at });\n    } else {\n      res.json({ connected: false });\n    }\n  } catch (error) {\n    res.status(500).json({ message: 'Server error' });\n  }\n};\n\n// @desc");

// Export loginGithub
content = content.replace("module.exports = {", "module.exports = {\n  loginGithub,");

fs.writeFileSync(path, content);
console.log('Patched');
