const express = require('express');
const router = express.Router();
const { 
  getProblems, 
  createProblem, 
  updateProblem, 
  deleteProblem, 
  getStats, 
  getTopics 
} = require('../controllers/dsaController');
const { protect } = require('../middleware/authMiddleware');
const { syncCodeforces } = require('../controllers/dsaSyncController');

router.route('/problems')
  .get(protect, getProblems)
  .post(protect, createProblem);

router.route('/problems/:id')
  .put(protect, updateProblem)
  .delete(protect, deleteProblem);

router.get('/stats', protect, getStats);
router.get('/topics', protect, getTopics);

module.exports = router;

router.post('/sync/codeforces', protect, syncCodeforces);
