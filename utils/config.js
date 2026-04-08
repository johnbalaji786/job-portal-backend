require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/job-portal';
const PORT = process.env.PORT || 3001;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
module.exports = {
    MONGODB_URI,
    PORT,
    EMAIL_USER,
    EMAIL_PASS,
};