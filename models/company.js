const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    website: { type: String },
    logo: { type: String, default: '' },
    industry: { type: String },
    location: { type: String },
    size: {
        type: String,
        enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1001+'],
    },
    foundedYear: { type: Number },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
}, { timestamps: true });

module.exports = mongoose.model('Company', companySchema, 'companies');