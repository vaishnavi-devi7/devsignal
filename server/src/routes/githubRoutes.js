const express = require('express');
const router = express.Router();
const { 
  authGithub, 
  githubCallback, 
  getStatus, 
  disconnectGithub, 
  syncGithub, 
  getOverview, 
  getRepositories 
} = require('../controllers/githubController');
const { protect } = require('../middleware/authMiddleware');

router.get('/auth', protect, authGithub);
// Callback does not use protect because GitHub redirects the browser here without a JWT header
router.get('/callback', githubCallback);
router.get('/status', protect, getStatus);
router.delete('/disconnect', protect, disconnectGithub);
router.post('/sync', protect, syncGithub);
router.get('/overview', protect, getOverview);
router.get('/repositories', protect, getRepositories);

module.exports = router;
