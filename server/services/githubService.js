const axios = require('axios');
const ErrorResponse = require('../utils/errorResponse');

class GithubService {
  constructor() {
    this.baseURL = 'https://api.github.com';
    // If no token is provided, GitHub rate limits are very strict (60/hour).
    // With token, it is 5000/hour.
    this.headers = {
      Accept: 'application/vnd.github.v3+json',
    };
    if (process.env.GITHUB_TOKEN && process.env.GITHUB_TOKEN !== 'your_github_personal_access_token_here') {
      this.headers.Authorization = `token ${process.env.GITHUB_TOKEN}`;
    }
  }

  handleRateLimit(error) {
    if (error.response && error.response.status === 403) {
      const remaining = error.response.headers['x-ratelimit-remaining'];
      if (remaining === '0') {
        throw new ErrorResponse('GitHub API rate limit exceeded. Please try again later.', 429);
      }
    }
  }

  async getProfile(username) {
    try {
      const response = await axios.get(`${this.baseURL}/users/${username}`, {
        headers: this.headers,
      });
      return response.data;
    } catch (error) {
      this.handleRateLimit(error);
      if (error.response && error.response.status === 404) {
        throw new ErrorResponse('GitHub user not found', 404);
      }
      throw new ErrorResponse('Error fetching GitHub profile', 500);
    }
  }

  async getRepositories(username) {
    try {
      const response = await axios.get(`${this.baseURL}/users/${username}/repos?per_page=100&sort=updated`, {
        headers: this.headers,
      });
      return response.data;
    } catch (error) {
      this.handleRateLimit(error);
      throw new ErrorResponse('Error fetching GitHub repositories', 500);
    }
  }

  async getPublicActivity(username) {
    try {
      // Fetch public events to count recent contributions
      const response = await axios.get(`${this.baseURL}/users/${username}/events/public?per_page=100`, {
        headers: this.headers,
      });
      return response.data.length || 0;
    } catch (error) {
      // Non-fatal if events fail, just return 0
      return 0; 
    }
  }

  async analyzeUser(username) {
    // 1. Fetch data in parallel
    const [profile, repos, recentEventsCount] = await Promise.all([
      this.getProfile(username),
      this.getRepositories(username),
      this.getPublicActivity(username)
    ]);

    // 2. Aggregate Repository Data
    let totalStars = 0;
    let totalForks = 0;
    
    // Sort repos by stars or recent activity to pick "top" ones, or just keep them all.
    // We will normalize them.
    const normalizedRepos = repos.map(repo => {
      totalStars += repo.stargazers_count;
      totalForks += repo.forks_count;

      // Determine an arbitrary 'activity level' based on pushed_at or size
      let activityLevel = 'Low';
      const daysSinceUpdate = (new Date() - new Date(repo.pushed_at)) / (1000 * 60 * 60 * 24);
      if (daysSinceUpdate < 7) activityLevel = 'Very High';
      else if (daysSinceUpdate < 30) activityLevel = 'High';
      else if (daysSinceUpdate < 90) activityLevel = 'Medium';

      return {
        name: repo.name,
        primary_language: repo.language || 'Unknown',
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        activity_level: activityLevel,
        last_updated: repo.pushed_at
      };
    });

    // 3. Normalize Profile Data
    const normalizedProfile = {
      github_username: profile.login,
      total_repositories: profile.public_repos,
      total_stars: totalStars,
      followers: profile.followers,
      total_contributions: recentEventsCount * 10, // Mock scaling factor for visual purposes since we can't easily get full year without GraphQL
    };

    return {
      profile: normalizedProfile,
      repositories: normalizedRepos
    };
  }
}

module.exports = new GithubService();
