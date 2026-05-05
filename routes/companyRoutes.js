const express = require('express');
const { createCompany, getAllCompanies, updateCompany, deleteCompany, createRecruiter, getAllRecruiters } = require('../controllers/adminController');
const { isAuthenticated, allowRoles } = require('../middleware/auth');

const companyRouter = express.Router();

//all routes are protected by admin authentication middleware only admin can access these routes to manage companies and recruiters
companyRouter.use(isAuthenticated);
companyRouter.use(allowRoles('admin'));

companyRouter.post('/', createCompany);
companyRouter.get('/', getAllCompanies);
companyRouter.put('/:id', updateCompany);
companyRouter.delete('/:id', deleteCompany);

companyRouter.post('/recruiters', createRecruiter);
companyRouter.get('/recruiters', getAllRecruiters);



module.exports = companyRouter;
