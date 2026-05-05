const express = require('express');
const { getAllJobs, updateJob, deleteJob, getrecruiterJobs, getApplicantJobs, getJobById, createJob } = require('../controllers/jobController');
const { isAuthenticated, allowRoles } = require('../middleware/auth');

const jobRouter = express.Router();

//public routes
jobRouter.get('/', getAllJobs);
jobRouter.get('/:id', getJobById);

//private routes
jobRouter.post('/', isAuthenticated, allowRoles('recruiter'), createJob);
jobRouter.put('/:id', isAuthenticated, allowRoles('recruiter'), updateJob);
jobRouter.delete('/:id', isAuthenticated, allowRoles('recruiter'), deleteJob);
jobRouter.get('/recruiter/jobs', isAuthenticated, allowRoles('recruiter'), getrecruiterJobs);
jobRouter.get('/recruiter/jobs/:id/applications', isAuthenticated, allowRoles('recruiter'), getApplicantJobs);

module.exports = jobRouter;