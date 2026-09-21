const axios = require('axios');
const db = require('../config/db');
const { syncGithubData } = require('../services/githubSyncService');
const { getGithubOverviewForUser } = require('../services/githubService2');
const { generateOAuthState } = require('../utils/crypto');
const generateToken = require('../utils/generateToken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

// @desc    Initiate GitHub OAuth
// @route   GET /api/github/auth
// @access  Private

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
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=read:user,user:email&state=${state}`;
  
  res.json({ url: githubAuthUrl });
};

const authGithub = async (req, res) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const redirectUri = process.env.GITHUB_CALLBACK_URL;
  
  // Generate secure random state
  const state = generateOAuthState();
  
  // Store state in DB with 10 mins expiration
  try {
    await db.query(
      "INSERT INTO oauth_states (state, user_id, expires_at) VALUES ($1, $2, CURRENT_TIMESTAMP + INTERVAL '10 minutes')",
      [state, req.user.id]
    );
  } catch (error) {
    console.error('State generation error:', error);
    return res.status(500).json({ message: 'Failed to initiate OAuth flow' });
  }
  
  // Use minimum permission: read:user
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=read:user&state=${state}`;
  
  res.json({ url: githubAuthUrl });
};

// @desc    Handle GitHub OAuth callback
// @route   GET /api/github/callback
// @access  Public (Redirected from GitHub)
const githubCallback = async (req, res) => {
  const { code, state } = req.query;
  
  if (!code || !state) {
    return res.redirect(`${process.env.FRONTEND_URL}/login?error=invalid_request`);
  }

  try {
    const stateRes = await db.query(
      "SELECT user_id FROM oauth_states WHERE state = $1 AND expires_at > CURRENT_TIMESTAMP",
      [state]
    );
    
    if (stateRes.rows.length === 0) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=invalid_state`);
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
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
    }

    if (userId) {
      // Connect Flow
      await syncGithubData(userId, accessToken);
      return res.redirect(`${process.env.FRONTEND_URL}/github`);
    } else {
      // Login/Signup Flow
      const userRes = await axios.get('https://api.github.com/user', {
        headers: { Authorization: `Bearer ${accessToken}` }
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
            headers: { Authorization: `Bearer ${accessToken}` }
          });
          const primaryEmail = emailRes.data.find(e => e.primary && e.verified) || emailRes.data.find(e => e.verified) || emailRes.data[0];
          email = primaryEmail ? primaryEmail.email : null;
        }
        
        if (!email) {
          return res.redirect(`${process.env.FRONTEND_URL}/login?error=no_email`);
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
      
      // Issue ONE-TIME OAuth code and sync github data
      await syncGithubData(devsignalUserId, accessToken);
      
      const crypto = require('crypto');
      const authCode = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins
      
      await db.query(
        'INSERT INTO oauth_codes (code, user_id, expires_at) VALUES ($1, $2, $3)',
        [authCode, devsignalUserId, expiresAt]
      );
      
      return res.redirect(`${process.env.FRONTEND_URL}/login?code=${authCode}`);
    }

  } catch (error) {
    console.error('GitHub Callback Error:', error.message);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=server_error`);
  }
};

// @desc    Check GitHub connection status
// @route   GET /api/github/status
// @access  Private
const getStatus = async (req, res) => {
  try {
    const { rows } = await db.query('SELECT github_username, updated_at FROM github_accounts WHERE user_id = $1', [req.user.id]);
    if (rows.length > 0) {
      res.json({ connected: true, username: rows[0].github_username, lastSynced: rows[0].updated_at });
    } else {
      res.json({ connected: false });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Disconnect GitHub
// @route   DELETE /api/github/disconnect
// @access  Private
const disconnectGithub = async (req, res) => {
  try {
    await db.query('DELETE FROM github_repositories WHERE user_id = $1', [req.user.id]);
    await db.query('DELETE FROM github_accounts WHERE user_id = $1', [req.user.id]);
    res.json({ message: 'GitHub disconnected successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Sync GitHub Data manually
// @route   POST /api/github/sync
// @access  Private
const syncGithub = async (req, res) => {
  try {
    const { rows } = await db.query('SELECT access_token FROM github_accounts WHERE user_id = $1', [req.user.id]);
    if (rows.length === 0 || !rows[0].access_token) {
      return res.status(400).json({ message: 'GitHub not connected' });
    }
    
    const { decrypt } = require('../utils/crypto');
    const token = decrypt(rows[0].access_token);
    
    if (!token) {
      return res.status(500).json({ message: 'Token decryption failed' });
    }
    
    await syncGithubData(req.user.id, token);
    res.json({ message: 'Sync successful' });
  } catch (error) {
    console.error(error);
    const status = error.response?.status || 500;
    res.status(status).json({ message: 'Sync failed' });
  }
};

// @desc    Get GitHub Overview stats
// @route   GET /api/github/overview
// @access  Private
const getOverview = async (req, res) => {
  try {
    const overview = await getGithubOverviewForUser(req.user.id);
    res.json(overview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get GitHub Repositories
// @route   GET /api/github/repositories
// @access  Private
const getRepositories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const countRes = await db.query('SELECT COUNT(*) FROM github_repositories WHERE user_id = $1', [req.user.id]);
    const total = parseInt(countRes.rows[0].count);

    const { rows } = await db.query(`
      SELECT name, full_name as "fullName", description, language, stars, forks, is_private as "isPrivate", html_url as url
      FROM github_repositories
      WHERE user_id = $1
      ORDER BY pushed_at DESC NULLS LAST
      LIMIT $2 OFFSET $3
    `, [req.user.id, limit, offset]);

    res.json({
      repositories: rows,
      pagination: {
        page,
        limit,
        total
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


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
    const userRes = await db.query('SELECT id, name, email FROM users WHERE id = $1', [user_id]);
    res.json({ token, user: userRes.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  loginGithub,
  authGithub,
  githubCallback,
  getStatus,
  disconnectGithub,
  syncGithub,
  getOverview,
  getRepositories,
  exchangeCode
};

