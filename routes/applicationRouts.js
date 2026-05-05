const express = require('express');

const { applyForJob, getUserApplications, updateApplicationStatus, getApplicationById } = require('../controllers/applicationController');
const { allowRoles, isAuthenticated } = require('../middleware/auth');

const applicationRouter = express.Router();

applicationRouter.use(isAuthenticated);

// user routes
applicationRouter.post('/:jobId/apply', allowRoles(['user']), applyForJob);
applicationRouter.get('/', allowRoles(['user']), getUserApplications);

// recruiter routes
applicationRouter.put('/:applicationId/status', allowRoles(['recruiter']), updateApplicationStatus);

// shared routes -- user and recruiter
applicationRouter.get('/:id', allowRoles(['user', 'recruiter']), getApplicationById);

module.exports = applicationRouter;