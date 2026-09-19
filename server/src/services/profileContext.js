const db = require('../config/db');

const buildProfileContext = async (userId) => {
  // 1. Load Resume Profile
  const { rows: resumeRows } = await db.query('SELECT * FROM resume_profiles WHERE user_id = $1', [userId]);
  const resume = resumeRows.length > 0 ? resumeRows[0] : null;

  // 2. Load GitHub Overview & Repos
  const { rows: githubAccRows } = await db.query('SELECT github_username, html_url FROM github_accounts WHERE user_id = $1', [userId]);
  const githubAccount = githubAccRows.length > 0 ? githubAccRows[0] : null;

  const { rows: githubRepos } = await db.query(
    'SELECT name, description, language, stars, forks FROM github_repositories WHERE user_id = $1 ORDER BY stars DESC LIMIT 15', 
    [userId]
  );

  // 3. Load DSA Stats
  const { rows: dsaProbs } = await db.query(
    'SELECT title, difficulty, topic, platform, status, language FROM dsa_problems WHERE user_id = $1', 
    [userId]
  );
  
  const dsaSolved = dsaProbs.filter(p => p.status === 'Solved');
  const dsaAggregated = {
    total_solved: dsaSolved.length,
    difficulties: {
      Easy: dsaSolved.filter(p => p.difficulty === 'Easy').length,
      Medium: dsaSolved.filter(p => p.difficulty === 'Medium').length,
      Hard: dsaSolved.filter(p => p.difficulty === 'Hard').length
    },
    topics: [...new Set(dsaSolved.map(p => p.topic).filter(Boolean))]
  };

  // Compile stripped compact profile
  const context = {
    resume: resume ? {
      full_name: resume.full_name,
      skills: resume.skills,
      programming_languages: resume.programming_languages,
      frameworks: resume.frameworks,
      databases: resume.databases,
      tools: resume.tools,
      education: resume.education, // Assuming JSON structure
      experience: resume.experience,
      projects: resume.projects,
      certifications: resume.certifications
    } : null,
    github: githubAccount ? {
      stats: githubAccount,
      repositories: githubRepos
    } : null,
    dsa: dsaSolved.length > 0 ? dsaAggregated : null
  };

  return context;
};

module.exports = {
  buildProfileContext
};
