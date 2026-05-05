const { create } = require("../models/user");
const Company = require("../models/company");
const User = require("../models/user");
const { route } = require("../routes/companyRoutes");
const bycrypt = require("bcrypt");

const createCompany = async (req, res) => { 

    try {
        //get company details from request body

        const { name, description, website, industry, location, size, foundedYear } = req.body;
        
        const newcompany = new Company({
            name,
            description,
            website,
            industry,
            location,
            size,
            foundedYear,
            createdBy: req.user._id
        });

        //if the company already exists return error
        const existingCompany = await Company.findOne({ name });
        if (existingCompany) {
            return res.status(400).json({ message: 'Company already exists' });
        }   

        const savedCompany = await newcompany.save();
        
        if (savedCompany) {
            res.status(201).json({ message: 'Company created successfully', company: savedCompany });
        } else {
            res.status(500).json({ message: 'Failed to create company' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to create company' , error: error.message });
    }

}

const getAllCompanies = async (req, res) => {

    try { 
        const companies = await Company.find().populate("createdBy", "name");

        res.status(200).json({ companies });
        
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch companies', error: error.message });
    }
}

const updateCompany = async (req, res) => {

    try {
        const { id } = req.params;
        const update = req.body;
        const updatedCompany = await Company.findByIdAndUpdate(id, update, { new: true });

        if (!updatedCompany) {
            return res.status(404).json({ message: 'Company not found' });
        }

      res.status(200).json({ message: 'Company updated successfully', company: updatedCompany });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update company', error: error.message });
    }
}

const deleteCompany = async (req, res) => {

    try {
        const { id } = req.params;
        const deletedCompany = await Company.findByIdAndDelete(id);

        if (!deletedCompany) {
            return res.status(404).json({ message: 'Company not found' });
        }

        res.status(200).json({ message: 'Company deleted successfully', company: deletedCompany });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete company', error: error.message });
    }
}

const createRecruiter = async (req, res) => {

    try {
        //create a recruiter user and assign the recruiter to the company
        const { name, email, password, companyId } = req.body;

        //check if the user exists
        const existingUser  = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // check if the company exists
        const company = await Company.findById(companyId);

        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }   

        //hash the password
        const hashedPassword = await bycrypt.hash(password, 10);
        
        const newRecruiter = new User({
            name,
            email,
            password: hashedPassword,
            role: 'recruiter',
            assignedCompany: companyId
        });

        const savedRecruiter = await newRecruiter.save();

        if (savedRecruiter) {
            res.status(201).json({ message: 'Recruiter created successfully', recruiter: savedRecruiter });
        } else {
            res.status(500).json({ message: 'Failed to create recruiter' });
        }

    } catch (error) {
        res.status(500).json({ message: 'Failed to create recruiter', error: error.message });
    }
}

const getAllRecruiters = async (req, res) => {

    try {
        //fetch all recruiters and populate the assigned company details
        const recruiters = await User.find({ role: 'recruiter' }).populate('assignedCompany', 'name');

       res.status(200).json({ recruiters });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch recruiters', error: error.message });
    }
}

module.exports = {
    createCompany,
    getAllCompanies,
    updateCompany,
    deleteCompany,
    createRecruiter,
    getAllRecruiters
};