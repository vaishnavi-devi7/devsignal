const db = require('../config/db');
const { getGithubUser, getUserRepositories } = require('./githubService');
const { encrypt } = require('../utils/crypto');

const syncGithubData = async (userId, accessToken) => {
  try {
    // 1. Fetch user data
    const githubUser = await getGithubUser(accessToken);

    // Encrypt token
    const encryptedToken = encrypt(accessToken);

    // 2. Upsert github_accounts
    await db.query(
      `INSERT INTO github_accounts (user_id, github_username, github_id, access_token, avatar_url, html_url)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (user_id) 
       DO UPDATE SET 
         github_username = EXCLUDED.github_username,
         github_id = EXCLUDED.github_id,
         access_token = EXCLUDED.access_token,
         avatar_url = EXCLUDED.avatar_url,
         html_url = EXCLUDED.html_url,
         updated_at = CURRENT_TIMESTAMP`,
      [userId, githubUser.login, githubUser.id.toString(), encryptedToken, githubUser.avatar_url, githubUser.html_url]
    );

    // 3. Fetch repositories
    const repos = await getUserRepositories(accessToken);

    // 4. Upsert repositories
    for (const repo of repos) {
      await db.query(
        `INSERT INTO github_repositories (
          user_id, github_repo_id, name, full_name, description, html_url, 
          language, stars, forks, open_issues, is_private, is_fork, 
          default_branch, pushed_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        ON CONFLICT (user_id, github_repo_id) 
        DO UPDATE SET
          name = EXCLUDED.name,
          full_name = EXCLUDED.full_name,
          description = EXCLUDED.description,
          html_url = EXCLUDED.html_url,
          language = EXCLUDED.language,
          stars = EXCLUDED.stars,
          forks = EXCLUDED.forks,
          open_issues = EXCLUDED.open_issues,
          is_private = EXCLUDED.is_private,
          is_fork = EXCLUDED.is_fork,
          default_branch = EXCLUDED.default_branch,
          pushed_at = EXCLUDED.pushed_at,
          updated_at = CURRENT_TIMESTAMP`,
        [
          userId, 
          repo.id, 
          repo.name, 
          repo.full_name, 
          repo.description, 
          repo.html_url,
          repo.language, 
          repo.stargazers_count, 
          repo.forks_count, 
          repo.open_issues_count, 
          repo.private, 
          repo.fork,
          repo.default_branch, 
          repo.pushed_at
        ]
      );
    }

    return {
      success: true,
      repositoryCount: repos.length
    };
  } catch (error) {
    console.error('Error syncing GitHub data:', error.message);
    throw error;
  }
};

module.exports = {
  syncGithubData
};
