const express = require('express');
const router = express.Router();
const { getJobs, getJob, getJobMatch, saveJob, unsaveJob, getSavedJobs } = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getJobs);
router.get('/saved', getSavedJobs);
router.get('/:id', getJob);
router.get('/:id/match', getJobMatch);
router.post('/:id/save', saveJob);
router.delete('/:id/save', unsaveJob);

module.exports = router;
