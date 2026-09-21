const db = require('../config/db');

const getDsaStatsForUser = async (userId) => {
  const statsRes = await db.query(`
    SELECT 
      COUNT(*) as total_count,
      SUM(CASE WHEN status = 'Solved' THEN 1 ELSE 0 END) as total_solved,
      SUM(CASE WHEN status = 'Attempted' THEN 1 ELSE 0 END) as total_attempted,
      SUM(CASE WHEN status = 'Solved' AND difficulty = 'Easy' THEN 1 ELSE 0 END) as easy_solved,
      SUM(CASE WHEN status = 'Solved' AND difficulty = 'Medium' THEN 1 ELSE 0 END) as medium_solved,
      SUM(CASE WHEN status = 'Solved' AND difficulty = 'Hard' THEN 1 ELSE 0 END) as hard_solved
    FROM dsa_problems
    WHERE user_id = $1
  `, [userId]);
  
  const stats = statsRes.rows[0] || {};

  const platformRes = await db.query(`
    SELECT platform, COUNT(*) as count 
    FROM dsa_problems 
    WHERE user_id = $1 AND platform IS NOT NULL 
    GROUP BY platform 
    ORDER BY count DESC
  `, [userId]);

  const languageRes = await db.query(`
    SELECT language, COUNT(*) as count 
    FROM dsa_problems 
    WHERE user_id = $1 AND language IS NOT NULL 
    GROUP BY language 
    ORDER BY count DESC
  `, [userId]);

  const datesRes = await db.query(`
    SELECT DISTINCT solved_at 
    FROM dsa_problems 
    WHERE user_id = $1 AND status = 'Solved' AND solved_at IS NOT NULL 
    ORDER BY solved_at DESC
  `, [userId]);

  let currentStreak = 0;
  let longestStreak = 0;

  if (datesRes.rows.length > 0) {
    const dates = datesRes.rows.map(row => new Date(row.solved_at).setHours(0,0,0,0));
    const today = new Date().setHours(0,0,0,0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (dates[0] === today || dates[0] === yesterday.getTime()) {
      currentStreak = 1;
      let tempStreak = 1;
      longestStreak = 1;

      for (let i = 1; i < dates.length; i++) {
        const diffDays = Math.round((dates[i-1] - dates[i]) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          tempStreak++;
          currentStreak = tempStreak;
          if (tempStreak > longestStreak) {
            longestStreak = tempStreak;
          }
        } else {
          tempStreak = 1;
        }
      }
    }
  }

  return {
    totalSolved: parseInt(stats.total_solved) || 0,
    easy: parseInt(stats.easy_solved) || 0,
    medium: parseInt(stats.medium_solved) || 0,
    hard: parseInt(stats.hard_solved) || 0,
    totalAttempted: parseInt(stats.total_attempted) || 0,
    languages: languageRes.rows,
    platforms: platformRes.rows,
    currentStreak,
    longestStreak
  };
};

module.exports = {
  getDsaStatsForUser
};
