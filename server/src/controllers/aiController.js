const db = require('../config/db');
const { buildProfileContext } = require('../services/profileContext');
const { callAI, generateInputHash } = require('../services/aiService');
const { matchJob } = require('../services/jobMatcher');

const SYSTEM_PROMPT = `
You are an expert technical recruiter and developer career coach analyzing a developer profile.
Use ONLY the supplied profile context.
Do not invent skills, projects, experience, achievements, certifications, or job requirements.
If information is unavailable, say that it is unavailable.
Do not infer sensitive personal characteristics.
Do not make claims about the user's intelligence, mental state, health, or personality.
Keep recommendations practical and technically grounded.
Return ONLY valid JSON.
`;

const getCachedInsight = async (userId, insightType, hash) => {
  const { rows } = await db.query(
    'SELECT response_json FROM ai_insights WHERE user_id = $1 AND insight_type = $2 AND input_hash = $3',
    [userId, insightType, hash]
  );
  return rows.length > 0 ? rows[0].response_json : null;
};

const saveCachedInsight = async (userId, insightType, hash, data) => {
  await db.query(
    `INSERT INTO ai_insights (user_id, insight_type, input_hash, response_json) 
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (user_id, insight_type, input_hash) 
     DO UPDATE SET response_json = EXCLUDED.response_json, updated_at = CURRENT_TIMESTAMP`,
    [userId, insightType, hash, data]
  );
};

// @desc    Get AI Profile Analysis
// @route   GET /api/ai/profile-analysis
// @access  Private
const getProfileAnalysis = async (req, res) => {
  try {
    const context = await buildProfileContext(req.user.id);
    const hash = generateInputHash(context);

    const cached = await getCachedInsight(req.user.id, 'profile_analysis', hash);
    if (cached) return res.json(cached);

    const prompt = `
Analyze the following developer profile and provide a structured assessment.
Profile Context:
${JSON.stringify(context, null, 2)}

Expected JSON format:
{
  "summary": "String (1-2 paragraphs)",
  "strengths": ["String", ...],
  "skillGaps": ["String", ...],
  "projectInsights": ["String", ...],
  "dsaInsights": ["String", ...],
  "careerFocus": ["String", ...]
}`;

    const result = await callAI(prompt, SYSTEM_PROMPT);
    await saveCachedInsight(req.user.id, 'profile_analysis', hash, result);
    res.json(result);
  } catch (error) {
    if (error.message === 'AI service is not configured.') {
      return res.status(503).json({ message: 'AI service is not configured.' });
    }
    console.error(error);
    res.status(500).json({ message: 'AI insights are currently unavailable.' });
  }
};

// @desc    Get AI Roadmap
// @route   GET /api/ai/roadmap
// @access  Private
const getRoadmap = async (req, res) => {
  try {
    const context = await buildProfileContext(req.user.id);
    const hash = generateInputHash(context);

    const cached = await getCachedInsight(req.user.id, 'roadmap', hash);
    if (cached) return res.json(cached);

    const prompt = `
Generate a structured developer improvement roadmap based on the following profile.
Focus on actual skill gaps and practical next steps for their current tech stack.
Profile Context:
${JSON.stringify(context, null, 2)}

Expected JSON format:
{
  "goal": "String",
  "phases": [
    {
      "title": "String",
      "duration": "String (e.g. Weeks 1-4)",
      "skills": ["String", ...],
      "actions": ["String", ...],
      "reason": "String"
    }
  ]
}`;

    const result = await callAI(prompt, SYSTEM_PROMPT);
    await saveCachedInsight(req.user.id, 'roadmap', hash, result);
    res.json(result);
  } catch (error) {
    if (error.message === 'AI service is not configured.') {
      return res.status(503).json({ message: 'AI service is not configured.' });
    }
    console.error(error);
    res.status(500).json({ message: 'AI insights are currently unavailable.' });
  }
};

// @desc    Get Job Insight
// @route   GET /api/ai/jobs/:id/insight
// @access  Private
const getJobInsight = async (req, res) => {
  try {
    const jobId = req.params.id;
    const context = await buildProfileContext(req.user.id);
    const matchData = await matchJob(req.user.id, jobId);
    
    const { rows: jobRows } = await db.query('SELECT * FROM jobs WHERE id = $1', [jobId]);
    if (jobRows.length === 0) return res.status(404).json({ message: 'Job not found' });
    const jobData = jobRows[0];

    const inputData = { context, jobData, matchData };
    const hash = generateInputHash(inputData);

    const cached = await getCachedInsight(req.user.id, `job_insight_${jobId}`, hash);
    if (cached) return res.json(cached);

    const prompt = `
Explain the fit between the candidate and the job description based on the deterministic match score.
DO NOT recalculate the score or generate a new percentage.

Deterministic Match Data:
${JSON.stringify(matchData, null, 2)}

Job Details:
${JSON.stringify(jobData, null, 2)}

Profile Context:
${JSON.stringify(context, null, 2)}

Expected JSON format:
{
  "summary": "String (Overall verdict on fit)",
  "whyItFits": ["String", ...],
  "whatToImprove": ["String", ...],
  "interviewFocus": ["String", ...]
}`;

    const result = await callAI(prompt, SYSTEM_PROMPT);
    await saveCachedInsight(req.user.id, `job_insight_${jobId}`, hash, result);
    res.json(result);
  } catch (error) {
    if (error.message === 'AI service is not configured.') {
      return res.status(503).json({ message: 'AI service is not configured.' });
    }
    console.error(error);
    res.status(500).json({ message: 'AI insights are currently unavailable.' });
  }
};

// @desc    Get AI Interview Prep
// @route   GET /api/ai/interview-prep
// @access  Private
const getInterviewPrep = async (req, res) => {
  try {
    const context = await buildProfileContext(req.user.id);
    const hash = generateInputHash(context);

    const cached = await getCachedInsight(req.user.id, 'interview_prep', hash);
    if (cached) return res.json(cached);

    const prompt = `
Generate interview preparation materials based on the technologies, projects, and DSA topics present in the user's profile.
Do not invent projects or technologies they haven't listed.
Profile Context:
${JSON.stringify(context, null, 2)}

Expected JSON format:
{
  "technicalTopics": [
    { "topic": "String", "questions": ["String", ...] }
  ],
  "projectQuestions": [
    { "project": "String", "questions": ["String", ...] }
  ],
  "dsaTopics": [
    { "topic": "String", "advice": "String" }
  ],
  "behavioralThemes": ["String", ...]
}`;

    const result = await callAI(prompt, SYSTEM_PROMPT);
    await saveCachedInsight(req.user.id, 'interview_prep', hash, result);
    res.json(result);
  } catch (error) {
    if (error.message === 'AI service is not configured.') {
      return res.status(503).json({ message: 'AI service is not configured.' });
    }
    console.error(error);
    res.status(500).json({ message: 'AI insights are currently unavailable.' });
  }
};

module.exports = {
  getProfileAnalysis,
  getRoadmap,
  getJobInsight,
  getInterviewPrep
};
