const db = require('../config/db');
const { parseResume } = require('../services/resumeParser');
const fs = require('fs');
const path = require('path');

// @desc    Get current user's resume
// @route   GET /api/resume
// @access  Private
const getResume = async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT id, file_name, file_type, full_name, email, phone, location, skills, programming_languages, frameworks, databases, tools, education, experience, projects, certifications, updated_at FROM resume_profiles WHERE user_id = $1',
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.json({ resume: null });
    }

    res.json({ resume: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Upload and parse resume
// @route   POST /api/resume/upload
// @access  Private
const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const file = req.file;
    const allowedMimeTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      fs.unlinkSync(file.path);
      return res.status(400).json({ message: 'Please upload a PDF or DOCX file.' });
    }

    if (file.size > 5 * 1024 * 1024) {
      fs.unlinkSync(file.path);
      return res.status(400).json({ message: 'Resume must be smaller than 5 MB.' });
    }

    // Process file
    let parsedData;
    try {
      parsedData = await parseResume(file.path, file.mimetype);
    } catch (err) {
      fs.unlinkSync(file.path);
      return res.status(400).json({ message: err.message });
    }

    // Delete temp file immediately after extracting text
    fs.unlinkSync(file.path);

    // Upsert into database
    const { rows } = await db.query(
      `INSERT INTO resume_profiles (
        user_id, file_name, file_type, raw_text, full_name, email, phone, location,
        skills, programming_languages, frameworks, databases, tools
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      ON CONFLICT (user_id) DO UPDATE SET
        file_name = EXCLUDED.file_name,
        file_type = EXCLUDED.file_type,
        raw_text = EXCLUDED.raw_text,
        full_name = EXCLUDED.full_name,
        email = EXCLUDED.email,
        phone = EXCLUDED.phone,
        location = EXCLUDED.location,
        skills = EXCLUDED.skills,
        programming_languages = EXCLUDED.programming_languages,
        frameworks = EXCLUDED.frameworks,
        databases = EXCLUDED.databases,
        tools = EXCLUDED.tools,
        updated_at = CURRENT_TIMESTAMP
      RETURNING id, file_name, file_type, full_name, email, phone, location, skills, programming_languages, frameworks, databases, tools, education, experience, projects, certifications, updated_at`,
      [
        req.user.id,
        file.originalname,
        file.mimetype,
        parsedData.raw_text,
        parsedData.full_name,
        parsedData.email,
        parsedData.phone,
        parsedData.location,
        JSON.stringify(parsedData.skills),
        JSON.stringify(parsedData.programming_languages),
        JSON.stringify(parsedData.frameworks),
        JSON.stringify(parsedData.databases),
        JSON.stringify(parsedData.tools)
      ]
    );

    res.json({ resume: rows[0] });
  } catch (error) {
    console.error(error);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: 'Something went wrong while processing your resume.' });
  }
};

// @desc    Update manual fields in resume
// @route   PUT /api/resume
// @access  Private
const updateResume = async (req, res) => {
  try {
    const {
      full_name, email, phone, location,
      skills, programming_languages, frameworks, databases, tools,
      education, experience, projects, certifications
    } = req.body;

    const { rows } = await db.query(
      `UPDATE resume_profiles SET
        full_name = COALESCE($1, full_name),
        email = COALESCE($2, email),
        phone = COALESCE($3, phone),
        location = COALESCE($4, location),
        skills = COALESCE($5, skills),
        programming_languages = COALESCE($6, programming_languages),
        frameworks = COALESCE($7, frameworks),
        databases = COALESCE($8, databases),
        tools = COALESCE($9, tools),
        education = COALESCE($10, education),
        experience = COALESCE($11, experience),
        projects = COALESCE($12, projects),
        certifications = COALESCE($13, certifications),
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $14
      RETURNING id, file_name, file_type, full_name, email, phone, location, skills, programming_languages, frameworks, databases, tools, education, experience, projects, certifications, updated_at`,
      [
        full_name, email, phone, location,
        skills ? JSON.stringify(skills) : null,
        programming_languages ? JSON.stringify(programming_languages) : null,
        frameworks ? JSON.stringify(frameworks) : null,
        databases ? JSON.stringify(databases) : null,
        tools ? JSON.stringify(tools) : null,
        education ? JSON.stringify(education) : null,
        experience ? JSON.stringify(experience) : null,
        projects ? JSON.stringify(projects) : null,
        certifications ? JSON.stringify(certifications) : null,
        req.user.id
      ]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    res.json({ resume: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete user's resume
// @route   DELETE /api/resume
// @access  Private
const deleteResume = async (req, res) => {
  try {
    const { rowCount } = await db.query('DELETE FROM resume_profiles WHERE user_id = $1', [req.user.id]);
    
    if (rowCount === 0) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    
    res.json({ message: 'Resume removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getResume,
  uploadResume,
  updateResume,
  deleteResume
};
