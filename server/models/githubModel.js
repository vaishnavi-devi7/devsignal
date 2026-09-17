const db = require('../config/db');

class GithubModel {
  static async upsertProfile(userId, profileData) {
    const { github_username, total_repositories, total_stars, followers, total_contributions } = profileData;

    const query = `
      INSERT INTO github_profiles (user_id, github_username, total_repositories, total_stars, followers, total_contributions)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (user_id) 
      DO UPDATE SET 
        github_username = EXCLUDED.github_username,
        total_repositories = EXCLUDED.total_repositories,
        total_stars = EXCLUDED.total_stars,
        followers = EXCLUDED.followers,
        total_contributions = EXCLUDED.total_contributions,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *;
    `;
    
    const { rows } = await db.query(query, [
      userId, 
      github_username, 
      total_repositories, 
      total_stars, 
      followers, 
      total_contributions
    ]);
    return rows[0];
  }

  static async syncRepositories(profileId, repositoriesData) {
    const client = await db.pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Clear old repositories
      await client.query('DELETE FROM github_repositories WHERE github_profile_id = $1', [profileId]);
      
      // Insert new repositories (take top 10 to save DB space if user has hundreds)
      const topRepos = repositoriesData.sort((a, b) => b.stars - a.stars).slice(0, 10);
      
      const insertQuery = `
        INSERT INTO github_repositories (github_profile_id, name, primary_language, stars, forks, activity_level, last_updated)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `;

      for (const repo of topRepos) {
        await client.query(insertQuery, [
          profileId,
          repo.name,
          repo.primary_language,
          repo.stars,
          repo.forks,
          repo.activity_level,
          repo.last_updated
        ]);
      }
      
      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }

  static async getProfileByUserId(userId) {
    const { rows } = await db.query('SELECT * FROM github_profiles WHERE user_id = $1', [userId]);
    return rows[0];
  }

  static async getRepositoriesByProfileId(profileId) {
    const { rows } = await db.query('SELECT * FROM github_repositories WHERE github_profile_id = $1 ORDER BY stars DESC', [profileId]);
    return rows;
  }
}

module.exports = GithubModel;
