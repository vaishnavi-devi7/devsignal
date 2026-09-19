const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { getProfileAnalysis, getRoadmap, getJobInsight, getInterviewPrep } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP/User to 10 requests per windowMs for AI endpoints
  message: { message: 'Too many AI requests, please try again later.' }
});

router.use(protect);
router.use(aiLimiter);

router.get('/profile-analysis', getProfileAnalysis);
router.get('/roadmap', getRoadmap);
router.get('/jobs/:id/insight', getJobInsight);
router.get('/interview-prep', getInterviewPrep);

module.exports = router;
