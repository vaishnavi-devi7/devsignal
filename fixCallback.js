const fs = require('fs');
const path = './server/src/controllers/githubController.js';
let content = fs.readFileSync(path, 'utf8');

const updatedCallback = `const githubCallback = async (req, res) => {
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
      const githubId = githubUser.id.toString();

      let devsignalUserId;
      
      // 1. Check if GitHub account is already linked
      const existingAccountRes = await db.query('SELECT user_id FROM github_accounts WHERE github_id = $1', [githubId]);
      
      if (existingAccountRes.rows.length > 0) {
        devsignalUserId = existingAccountRes.rows[0].user_id;
      } else {
        // 2. Not linked. Check if email exists
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
  
        const devsignalUserResult = await db.query('SELECT id FROM users WHERE email = $1', [email]);
        
        if (devsignalUserResult.rows.length > 0) {
          devsignalUserId = devsignalUserResult.rows[0].id;
        } else {
          // 3. Create new user
          const randomPassword = crypto.randomBytes(32).toString('hex');
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(randomPassword, salt);
          const newName = githubUser.name || githubUser.login;
          
          const newUserRes = await db.query(
            'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id',
            [newName, email, hashedPassword]
          );
          devsignalUserId = newUserRes.rows[0].id;
          await db.query('INSERT INTO user_profiles (user_id) VALUES ($1)', [devsignalUserId]);
        }
      }
      
      // Issue token and sync github data
      const token = generateToken(devsignalUserId);
      await syncGithubData(devsignalUserId, accessToken);
      
      return res.redirect(\`\${process.env.FRONTEND_URL}/login?token=\${token}\`);
    }

  } catch (error) {
    console.error('GitHub Callback Error:', error.message);
    res.redirect(\`\${process.env.FRONTEND_URL}/login?error=server_error\`);
  }
};`;

content = content.replace(/const githubCallback = async.*?res\.redirect\(`\${process\.env\.FRONTEND_URL}\/login\?error=server_error`\);\n  \}\n\};/s, updatedCallback);

fs.writeFileSync(path, content);
console.log('Fixed callback in githubController.js');
