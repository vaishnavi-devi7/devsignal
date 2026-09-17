const express = require('express');
const { syncGithub, getGithubData } = require('../controllers/githubController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/sync', protect, syncGithub);
router.get('/', protect, getGithubData);

module.exports = router;
