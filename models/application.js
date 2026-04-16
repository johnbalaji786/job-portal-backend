const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    applicant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['applied', 'reviewing', 'interview', 'rejected', 'accepted'],
        default: 'applied',
    },
    coverLetter: {
        type: String,
    },
    resume: {
        type: String,
    },
    appliedAt: {
        type: Date,
        default: Date.now,
    },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    reviewedAt: {
        type: Date,
    },
    notes: {
        type: String,
    }
}, { timestamps: true });

// Compound index to ensure a user can apply only once per job
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema, 'applications');