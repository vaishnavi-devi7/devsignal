const axios = require('axios');

const handleGithubError = (error) => {
  if (error.response) {
    const status = error.response.status;
    if (status === 401) throw new Error('GitHub authentication failed (401). Token might be expired or invalid.');
    if (status === 403) throw new Error('GitHub forbidden (403). API rate limit likely exceeded.');
    if (status === 404) throw new Error('GitHub resource not found (404).');
    throw new Error(`GitHub API error (${status}): ${error.response.data?.message || 'Unknown error'}`);
  } else if (error.request) {
    throw new Error('GitHub network error. Could not connect to API.');
  }
  throw error;
};

const getGithubUser = async (accessToken) => {
  try {
    const response = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github.v3+json'
      }
    });
    return response.data;
  } catch (error) {
    handleGithubError(error);
  }
};

const getUserRepositories = async (accessToken) => {
  try {
    const response = await axios.get('https://api.github.com/user/repos', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github.v3+json'
      },
      params: {
        per_page: 100,
        sort: 'updated'
      }
    });
    return response.data;
  } catch (error) {
    handleGithubError(error);
  }
};

module.exports = {
  getGithubUser,
  getUserRepositories
};
