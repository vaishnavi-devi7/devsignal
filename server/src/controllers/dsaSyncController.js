const db = require('../config/db');
const axios = require('axios');

// @desc    Sync Codeforces problems
// @route   POST /api/dsa/sync/codeforces
// @access  Private
const syncCodeforces = async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ message: 'Codeforces username is required.' });
    }

    // Fetch from official Codeforces API
    const response = await axios.get(`https://codeforces.com/api/user.status?handle=${username}`);
    if (response.data.status !== 'OK') {
      return res.status(400).json({ message: 'Failed to fetch data from Codeforces.' });
    }

    const submissions = response.data.result;
    let imported = 0;

    for (const sub of submissions) {
      if (sub.verdict === 'OK') {
        const title = `[${sub.problem.contestId}${sub.problem.index}] ${sub.problem.name}`;
        // Codeforces rating loosely maps to difficulty
        let difficulty = 'Medium';
        if (!sub.problem.rating) difficulty = 'Medium'; // fallback
        else if (sub.problem.rating <= 1200) difficulty = 'Easy';
        else if (sub.problem.rating >= 1900) difficulty = 'Hard';

        const topic = (sub.problem.tags && sub.problem.tags.length > 0) ? sub.problem.tags[0] : 'General';
        const lang = sub.programmingLanguage || 'Unknown';
        const problemUrl = `https://codeforces.com/problemset/problem/${sub.problem.contestId}/${sub.problem.index}`;
        
        // Check uniqueness rule
        const existing = await db.query(
          'SELECT id FROM dsa_problems WHERE user_id = $1 AND platform = $2 AND title = $3',
          [req.user.id, 'Codeforces', title]
        );

        if (existing.rows.length === 0) {
          const solvedAt = new Date(sub.creationTimeSeconds * 1000);
          await db.query(
            `INSERT INTO dsa_problems 
            (user_id, title, platform, problem_url, difficulty, topic, status, language, solved_at) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
            [req.user.id, title, 'Codeforces', problemUrl, difficulty, topic, 'Solved', lang, solvedAt]
          );
          imported++;
        }
      }
    }

    res.json({ message: `Successfully synced ${imported} new problems from Codeforces.` });
  } catch (error) {
    console.error(error);
    if (error.response?.status === 400) {
      return res.status(400).json({ message: 'Invalid Codeforces handle.' });
    }
    res.status(500).json({ message: 'Server error during sync.' });
  }
};

module.exports = {
  syncCodeforces
};
