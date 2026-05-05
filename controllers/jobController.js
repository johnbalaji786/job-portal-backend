const { application } = require("../models/application");
const job = require("../models/job");

const getAllJobs = async (req, res) => {
    try {
        const { page = 1, limit = 10, search, location, jobType, experienceLevel } = req.query;
        const query = { isActive: true };
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { skills: { $regex: search, $options: 'i' } }
            ];
        }
        if (location) {
            query.location = { $regex: location, $options: 'i' };
        }
        if (jobType) {
            query.jobType = jobType;
        }
        if (experienceLevel) {
            query.experienceLevel = experienceLevel;
        }

        const jobs = await job.find(query)
            .skip((page - 1) * limit)
            .limit(limit * 1)
            .populate('company', 'name')
            .sort({ createdAt: -1 })
            .populate('postedBy', 'name email');
        
        const total = await job.countDocuments(query);


        res.status(200).json({
            jobs,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            totalJobs: total
        });
  } catch (error) {
    res.status(500).json({ message: 'failed to fetch jobs', error: error.message });
  }
}

const getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await job.findById(id).populate('company', 'name logo location description website').populate('postedBy', 'name');
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.status(200).json({ message: 'Job found', data: job });
  } catch (error) {
    res.status(500).json({ message: 'failed to fetch job', error: error.message });
  }
}

const createJob = async (req, res) => {
  console.log("REQ.USER 👉", req.user);
  try {
   const { title, description, requirements, salary, location, jobType, experienceLevel, skills, applicationDeadline } = req.body;
    const newJob = await job.create({
      title,
      description,
      requirements: requirements || [],
      salary,
      location,
      jobType,
      experienceLevel,
      skills: skills || [],
      applicationDeadline,
         company: req.user.assignedCompany, // ✅ FIX HERE
      postedBy: req.user._id             // ✅ better than req.userId
      
    });
    const savedJob = await newJob.save();
    
     const populatedJob = await savedJob.populate([
  { path: 'company', select: 'name logo' },
  { path: 'postedBy', select: 'name' }
  ]);
    res.status(201).json({ message: 'Job created successfully', data: populatedJob });
  } catch (error) {
    res.status(500).json({ message: 'failed to create job', error: error.message });
  }
}

const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;

    const updatedJob = await job.findByIdAndUpdate(id, update, { new: true });
    if (!updatedJob) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.status(200).json({ message: 'Job updated successfully', data: updatedJob });
  } catch (error) {
    res.status(500).json({ message: 'failed to update job', error: error.message });
  }
}

const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedJob = await job.findByIdAndDelete(id);
    if (!deletedJob) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.status(200).json({ message: 'Job deleted successfully', data: deletedJob });
  } catch (error) {
    res.status(500).json({ message: 'failed to delete job', error: error.message });
  }
}

const getrecruiterJobs = async (req, res) => {
    try {
      const jobs = await job.find({ postedBy: req.userId })
        .populate('company', 'name logo').sort({ createdAt: -1 });
      res.status(200).json({ message: 'Jobs fetched successfully for recruiter', data: jobs });
    } catch (error) {
      res.status(500).json({ message: 'failed to fetch jobs for recruiter', error: error.message });
    }
}

const getApplicantJobs = async (req, res) => {
    try {
      const { id } = req.params;
      
      //verify if the job belongs to the recruiter
      const jobs = await job.find({ _id: id, postedBy: req.userId });
      if(!jobs) {
        return res.status(404).json({ message: 'Job not found' });
      }
      const applicants = await application.find({ job: id })
        .populate('applicant', 'name email phone resume profilePicture bio skills experience location')
        .sort({ createdAt: -1 });
      res.status(200).json({ message: 'Applicants fetched successfully for job', data: applicants });
    } catch (error) {
      res.status(500).json({ message: 'failed to fetch jobs for applicant', error: error.message });
    }
}

module.exports = {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getrecruiterJobs,
  getApplicantJobs
};