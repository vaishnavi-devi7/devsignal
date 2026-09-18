const db = require('../config/db');
const { matchJob } = require('../services/jobMatcher');

// @desc    Get jobs
// @route   GET /api/jobs
// @access  Private
const getJobs = async (req, res) => {
  try {
    const { search, location, remote_type, employment_type, source, page = 1, limit = 20 } = req.query;
    
    let parsedPage = parseInt(page);
    let parsedLimit = parseInt(limit);
    if (isNaN(parsedPage) || parsedPage < 1) parsedPage = 1;
    if (isNaN(parsedLimit) || parsedLimit < 1) parsedLimit = 20;
    if (parsedLimit > 50) parsedLimit = 50;

    const offset = (parsedPage - 1) * parsedLimit;

    let queryStr = 'SELECT id, title, company, location, remote_type, employment_type, posted_at, source, skills, apply_url FROM jobs WHERE 1=1';
    let countQueryStr = 'SELECT COUNT(*) FROM jobs WHERE 1=1';
    const queryParams = [];
    let paramIndex = 1;

    if (search) {
      queryStr += ` AND (title ILIKE $${paramIndex} OR company ILIKE $${paramIndex})`;
      countQueryStr += ` AND (title ILIKE $${paramIndex} OR company ILIKE $${paramIndex})`;
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    if (location) {
      queryStr += ` AND location ILIKE $${paramIndex}`;
      countQueryStr += ` AND location ILIKE $${paramIndex}`;
      queryParams.push(`%${location}%`);
      paramIndex++;
    }

    if (remote_type) {
      queryStr += ` AND remote_type ILIKE $${paramIndex}`;
      countQueryStr += ` AND remote_type ILIKE $${paramIndex}`;
      queryParams.push(remote_type);
      paramIndex++;
    }

    if (employment_type) {
      queryStr += ` AND employment_type ILIKE $${paramIndex}`;
      countQueryStr += ` AND employment_type ILIKE $${paramIndex}`;
      queryParams.push(employment_type);
      paramIndex++;
    }

    if (source) {
      queryStr += ` AND source ILIKE $${paramIndex}`;
      countQueryStr += ` AND source ILIKE $${paramIndex}`;
      queryParams.push(source);
      paramIndex++;
    }

    queryStr += ` ORDER BY posted_at DESC NULLS LAST, id DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    
    const countParams = [...queryParams];
    
    queryParams.push(parsedLimit, offset);

    const [jobsRes, countRes] = await Promise.all([
      db.query(queryStr, queryParams),
      db.query(countQueryStr, countParams)
    ]);

    const total = parseInt(countRes.rows[0].count);
    const totalPages = Math.ceil(total / parsedLimit);

    res.json({
      jobs: jobsRes.rows,
      pagination: {
        page: parsedPage,
        limit: parsedLimit,
        total,
        totalPages
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get job details
// @route   GET /api/jobs/:id
// @access  Private
const getJob = async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM jobs WHERE id = $1', [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json({ job: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Match job with user profile
// @route   GET /api/jobs/:id/match
// @access  Private
const getJobMatch = async (req, res) => {
  try {
    const matchResult = await matchJob(req.user.id, req.params.id);
    res.json(matchResult);
  } catch (error) {
    console.error(error);
    if (error.message === 'Job not found') {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Save job
// @route   POST /api/jobs/:id/save
// @access  Private
const saveJob = async (req, res) => {
  try {
    await db.query(
      'INSERT INTO user_saved_jobs (user_id, job_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [req.user.id, req.params.id]
    );
    res.json({ message: 'Job saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Unsave job
// @route   DELETE /api/jobs/:id/save
// @access  Private
const unsaveJob = async (req, res) => {
  try {
    await db.query(
      'DELETE FROM user_saved_jobs WHERE user_id = $1 AND job_id = $2',
      [req.user.id, req.params.id]
    );
    res.json({ message: 'Job unsaved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get saved jobs
// @route   GET /api/jobs/saved
// @access  Private
const getSavedJobs = async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT j.id, j.title, j.company, j.location, j.remote_type, j.employment_type, j.posted_at, j.source, j.skills, j.apply_url, usj.created_at as saved_at
       FROM jobs j
       JOIN user_saved_jobs usj ON j.id = usj.job_id
       WHERE usj.user_id = $1
       ORDER BY usj.created_at DESC`,
      [req.user.id]
    );
    res.json({ jobs: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getJobs,
  getJob,
  getJobMatch,
  saveJob,
  unsaveJob,
  getSavedJobs
};
