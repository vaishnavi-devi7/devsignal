const db = require('../config/db');

// @desc    Get all DSA problems for a user
// @route   GET /api/dsa/problems
// @access  Private
const getProblems = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const { difficulty, topic, platform, status, search } = req.query;

    let query = 'SELECT * FROM dsa_problems WHERE user_id = $1';
    const queryParams = [req.user.id];
    let paramIndex = 2;

    if (difficulty) {
      query += ` AND difficulty = $${paramIndex++}`;
      queryParams.push(difficulty);
    }
    if (topic) {
      query += ` AND topic = $${paramIndex++}`;
      queryParams.push(topic);
    }
    if (platform) {
      query += ` AND platform = $${paramIndex++}`;
      queryParams.push(platform);
    }
    if (status) {
      query += ` AND status = $${paramIndex++}`;
      queryParams.push(status);
    }
    if (search) {
      query += ` AND title ILIKE $${paramIndex++}`;
      queryParams.push(`%${search}%`);
    }

    const countQuery = `SELECT COUNT(*) FROM (${query}) AS subquery`;
    const countRes = await db.query(countQuery, queryParams);
    const total = parseInt(countRes.rows[0].count);

    query += ` ORDER BY created_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    queryParams.push(limit, offset);

    const { rows } = await db.query(query, queryParams);

    res.json({
      problems: rows,
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

// @desc    Create a new DSA problem
// @route   POST /api/dsa/problems
// @access  Private
const createProblem = async (req, res) => {
  try {
    const { title, platform, problemUrl, difficulty, topic, status, language, solvedAt, notes } = req.body;

    if (!title || !platform || !difficulty || !status) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const { rows } = await db.query(
      `INSERT INTO dsa_problems (
        user_id, title, platform, problem_url, difficulty, topic, status, language, solved_at, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [req.user.id, title, platform, problemUrl || null, difficulty, topic || null, status, language || null, solvedAt || null, notes || null]
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    if (error.code === '23505') { // unique violation
      return res.status(400).json({ message: 'Problem already exists for this platform' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a DSA problem
// @route   PUT /api/dsa/problems/:id
// @access  Private
const updateProblem = async (req, res) => {
  try {
    const { title, platform, problemUrl, difficulty, topic, status, language, solvedAt, notes } = req.body;
    const { id } = req.params;

    const { rows } = await db.query(
      `UPDATE dsa_problems SET 
        title = COALESCE($1, title),
        platform = COALESCE($2, platform),
        problem_url = COALESCE($3, problem_url),
        difficulty = COALESCE($4, difficulty),
        topic = COALESCE($5, topic),
        status = COALESCE($6, status),
        language = COALESCE($7, language),
        solved_at = COALESCE($8, solved_at),
        notes = COALESCE($9, notes),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $10 AND user_id = $11 RETURNING *`,
      [title, platform, problemUrl, difficulty, topic, status, language, solvedAt, notes, id, req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Problem not found or unauthorized' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a DSA problem
// @route   DELETE /api/dsa/problems/:id
// @access  Private
const deleteProblem = async (req, res) => {
  try {
    const { id } = req.params;
    
    const { rowCount } = await db.query('DELETE FROM dsa_problems WHERE id = $1 AND user_id = $2', [id, req.user.id]);
    
    if (rowCount === 0) {
      return res.status(404).json({ message: 'Problem not found or unauthorized' });
    }
    
    res.json({ message: 'Problem removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get DSA Statistics (including streaks)
// @route   GET /api/dsa/stats
// @access  Private
const getStats = async (req, res) => {
  try {
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
    `, [req.user.id]);
    
    const stats = statsRes.rows[0];

    const platformRes = await db.query(`
      SELECT platform, COUNT(*) as count 
      FROM dsa_problems 
      WHERE user_id = $1 AND platform IS NOT NULL 
      GROUP BY platform 
      ORDER BY count DESC
    `, [req.user.id]);

    const languageRes = await db.query(`
      SELECT language, COUNT(*) as count 
      FROM dsa_problems 
      WHERE user_id = $1 AND language IS NOT NULL 
      GROUP BY language 
      ORDER BY count DESC
    `, [req.user.id]);

    // Calculate streaks
    const datesRes = await db.query(`
      SELECT DISTINCT solved_at 
      FROM dsa_problems 
      WHERE user_id = $1 AND status = 'Solved' AND solved_at IS NOT NULL 
      ORDER BY solved_at DESC
    `, [req.user.id]);

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let lastDate = null;
    
    // JS dates are messy, standardizing to midnight UTC for streak calc
    const today = new Date();
    today.setUTCHours(0,0,0,0);
    
    const dates = datesRes.rows.map(row => {
      const d = new Date(row.solved_at);
      d.setUTCHours(0,0,0,0);
      return d;
    });

    if (dates.length > 0) {
      // Find current streak
      let checkDate = new Date(today);
      if (dates[0].getTime() === checkDate.getTime()) {
         currentStreak = 1;
         checkDate.setDate(checkDate.getDate() - 1);
         for (let i = 1; i < dates.length; i++) {
           if (dates[i].getTime() === checkDate.getTime()) {
             currentStreak++;
             checkDate.setDate(checkDate.getDate() - 1);
           } else {
             break;
           }
         }
      } else {
         // Check if they solved yesterday (streak is still alive but hasn't solved today)
         checkDate.setDate(checkDate.getDate() - 1);
         if (dates[0].getTime() === checkDate.getTime()) {
           currentStreak = 1;
           checkDate.setDate(checkDate.getDate() - 1);
           for (let i = 1; i < dates.length; i++) {
             if (dates[i].getTime() === checkDate.getTime()) {
               currentStreak++;
               checkDate.setDate(checkDate.getDate() - 1);
             } else {
               break;
             }
           }
         }
      }

      // Find longest streak
      tempStreak = 1;
      longestStreak = 1;
      for (let i = 0; i < dates.length - 1; i++) {
        const curr = dates[i];
        const next = dates[i+1]; // older date since we sorted DESC
        
        const expectedNext = new Date(curr);
        expectedNext.setDate(expectedNext.getDate() - 1);
        
        if (next.getTime() === expectedNext.getTime()) {
          tempStreak++;
          if (tempStreak > longestStreak) {
            longestStreak = tempStreak;
          }
        } else {
          tempStreak = 1;
        }
      }
    }

    res.json({
      totalSolved: parseInt(stats.total_solved) || 0,
      easy: parseInt(stats.easy_solved) || 0,
      medium: parseInt(stats.medium_solved) || 0,
      hard: parseInt(stats.hard_solved) || 0,
      totalAttempted: parseInt(stats.total_attempted) || 0,
      languages: languageRes.rows,
      platforms: platformRes.rows,
      currentStreak,
      longestStreak
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get DSA Topic statistics
// @route   GET /api/dsa/topics
// @access  Private
const getTopics = async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT 
        topic, 
        SUM(CASE WHEN status = 'Solved' THEN 1 ELSE 0 END) as solved,
        SUM(CASE WHEN status = 'Attempted' THEN 1 ELSE 0 END) as attempted
      FROM dsa_problems
      WHERE user_id = $1 AND topic IS NOT NULL
      GROUP BY topic
      ORDER BY solved DESC
    `, [req.user.id]);

    res.json({ topics: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getProblems,
  createProblem,
  updateProblem,
  deleteProblem,
  getStats,
  getTopics
};
