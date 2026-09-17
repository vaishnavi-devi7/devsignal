const githubService = require('../services/githubService');
const GithubModel = require('../models/githubModel');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Sync GitHub profile data
// @route   POST /api/github/sync
// @access  Private
exports.syncGithub = async (req, res, next) => {
  try {
    const { username } = req.body;

    if (!username) {
      return next(new ErrorResponse('Please provide a GitHub username', 400));
    }

    // 1. Fetch from GitHub via Service
    const { profile, repositories } = await githubService.analyzeUser(username);

    // 2. Persist to Database via Model
    const savedProfile = await GithubModel.upsertProfile(req.user.id, profile);
    await GithubModel.syncRepositories(savedProfile.id, repositories);

    res.status(200).json({
      success: true,
      data: {
        profile: savedProfile,
        repositories: repositories.slice(0, 10) // Only returning what we saved
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get currently synced GitHub data
// @route   GET /api/github/
// @access  Private
exports.getGithubData = async (req, res, next) => {
  try {
    const profile = await GithubModel.getProfileByUserId(req.user.id);

    if (!profile) {
      return res.status(200).json({ success: true, data: null });
    }

    const repositories = await GithubModel.getRepositoriesByProfileId(profile.id);

    res.status(200).json({
      success: true,
      data: {
        profile,
        repositories
      }
    });
  } catch (err) {
    next(err);
  }
};
