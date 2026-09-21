const db = require('../config/db');

const getGithubOverviewForUser = async (userId) => {
  const accountRes = await db.query('SELECT github_username, avatar_url, html_url FROM github_accounts WHERE user_id = $1', [userId]);
  
  if (accountRes.rows.length === 0) {
    return { connected: false };
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
  `, [userId]);

  const stats = statsRes.rows[0];

  const langRes = await db.query(`
    SELECT language, COUNT(*) as count 
    FROM github_repositories 
    WHERE user_id = $1 AND language IS NOT NULL 
    GROUP BY language 
    ORDER BY count DESC
  `, [userId]);

  return {
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
  };
};

module.exports = { getGithubOverviewForUser };
