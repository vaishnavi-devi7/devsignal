const axios = require('axios');
const db = require('../config/db');
const { syncGithubData } = require('../services/githubSyncService');
const { generateOAuthState } = require('../utils/crypto');

// @desc    Initiate GitHub OAuth
// @route   GET /api/github/auth
// @access  Private
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
    return res.redirect(`${process.env.FRONTEND_URL}/github?error=invalid_request`);
  }

  try {
    // Look up state
    const stateRes = await db.query(
      "SELECT user_id FROM oauth_states WHERE state = $1 AND expires_at > CURRENT_TIMESTAMP",
      [state]
    );
    
    if (stateRes.rows.length === 0) {
      return res.redirect(`${process.env.FRONTEND_URL}/github?error=invalid_state`);
    }
    
    const userId = stateRes.rows[0].user_id;
    
    // Invalidate state to make it single-use
    await db.query("DELETE FROM oauth_states WHERE state = $1", [state]);

    // Exchange code for access token
    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: process.env.GITHUB_CALLBACK_URL,
      },
      {
        headers: { Accept: 'application/json' }
      }
    );

    const accessToken = tokenResponse.data.access_token;
    
    if (!accessToken) {
      console.error('Failed to obtain access token from GitHub');
      return res.redirect(`${process.env.FRONTEND_URL}/github?error=oauth_failed`);
    }

    // Sync GitHub data immediately
    await syncGithubData(userId, accessToken);

    // Redirect back to frontend
    res.redirect(`${process.env.FRONTEND_URL}/github`);
  } catch (error) {
    console.error('GitHub Callback Error:', error.message);
    res.redirect(`${process.env.FRONTEND_URL}/github?error=server_error`);
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
    const accountRes = await db.query('SELECT github_username, avatar_url, html_url FROM github_accounts WHERE user_id = $1', [req.user.id]);
    
    if (accountRes.rows.length === 0) {
      return res.json({ connected: false });
    }

    const account = accountRes.rows[0];

    const statsRes = await db.query(`
      SELECT 
        COUNT(*) as repo_count,
        SUM(CASE WHEN is_private = false THEN 1 ELSE 0 END) as public_repo_count,
        SUM(stars) as total_stars,
        SUM(forks) as total_forks,
        SUM(open_issues) as total_open_issues
      FROM github_repositories 
      WHERE user_id = $1
    `, [req.user.id]);

    const stats = statsRes.rows[0];

    // Language distribution
    const langRes = await db.query(`
      SELECT language, COUNT(*) as count 
      FROM github_repositories 
      WHERE user_id = $1 AND language IS NOT NULL 
      GROUP BY language 
      ORDER BY count DESC
    `, [req.user.id]);

    res.json({
      connected: true,
      username: account.github_username,
      avatarUrl: account.avatar_url,
      profileUrl: account.html_url,
      repositoryCount: parseInt(stats.repo_count) || 0,
      publicRepositoryCount: parseInt(stats.public_repo_count) || 0,
      totalStars: parseInt(stats.total_stars) || 0,
      totalForks: parseInt(stats.total_forks) || 0,
      totalOpenIssues: parseInt(stats.total_open_issues) || 0,
      languages: langRes.rows,
      recentActivity: [] 
    });
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

module.exports = {
  authGithub,
  githubCallback,
  getStatus,
  disconnectGithub,
  syncGithub,
  getOverview,
  getRepositories
};
