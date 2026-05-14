const { application } = require("../models/application");
const Job = require("../models/job");

const getAllJobs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      location,
      jobType,
      experienceLevel
    } = req.query;

    const query = { isActive: true };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { skills: { $regex: search, $options: "i" } }
      ];
    }

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    if (jobType) {
      query.jobType = jobType;
    }

    if (experienceLevel) {
      query.experienceLevel = experienceLevel;
    }

    const jobs = await Job.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate("company", "name")
      .populate("postedBy", "name email")
      .sort({ createdAt: -1 });

    const total = await Job.countDocuments(query);

    res.status(200).json({
      jobs,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      totalJobs: total
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to fetch jobs",
      error: error.message
    });
  }
};

const getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    const foundJob = await Job.findById(id)
      .populate(
        "company",
        "name logo location description website"
      )
      .populate("postedBy", "name");

    if (!foundJob) {
      return res.status(404).json({
        message: "Job not found"
      });
    }

    res.status(200).json({
      message: "Job found",
      job: foundJob
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to fetch job",
      error: error.message
    });
  }
};

const createJob = async (req, res) => {
  try {
    console.log("REQ.USER 👉", req.user);

    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experienceLevel,
      skills,
      applicationDeadline
    } = req.body;

    const newJob = await Job.create({
      title,
      description,
      requirements: requirements || [],
      salary,
      location,
      jobType,
      experienceLevel,
      skills: skills || [],
      applicationDeadline,
      company: req.user.assignedCompany,
      postedBy: req.user._id
    });

    const populatedJob = await newJob.populate([
      {
        path: "company",
        select: "name logo"
      },
      {
        path: "postedBy",
        select: "name"
      }
    ]);

    res.status(201).json({
      message: "Job created successfully",
      job: populatedJob
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to create job",
      error: error.message
    });
  }
};

const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;

    const updatedJob = await Job.findByIdAndUpdate(
      id,
      update,
      { new: true }
    );

    if (!updatedJob) {
      return res.status(404).json({
        message: "Job not found"
      });
    }

    res.status(200).json({
      message: "Job updated successfully",
      job: updatedJob
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to update job",
      error: error.message
    });
  }
};

const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedJob = await Job.findByIdAndDelete(id);

    if (!deletedJob) {
      return res.status(404).json({
        message: "Job not found"
      });
    }

    res.status(200).json({
      message: "Job deleted successfully",
      job: deletedJob
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to delete job",
      error: error.message
    });
  }
};

const getrecruiterJobs = async (req, res) => {
  try {
    const jobs = await Job.find({
      postedBy: req.userId
    })
      .populate("company", "name logo")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Jobs fetched successfully for recruiter",
      jobs
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to fetch recruiter jobs",
      error: error.message
    });
  }
};

const getApplicantJobs = async (req, res) => {
  try {
    const { id } = req.params;

    const foundJob = await Job.findOne({
      _id: id,
      postedBy: req.userId
    });

    if (!foundJob) {
      return res.status(404).json({
        message: "Job not found"
      });
    }

    const applicants = await application.find({
      job: id
    })
      .populate(
        "applicant",
        "name email phone resume profilePicture bio skills experience location"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Applicants fetched successfully",
      applicants
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to fetch applicants",
      error: error.message
    });
  }
};

module.exports = {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getrecruiterJobs,
  getApplicantJobs
};