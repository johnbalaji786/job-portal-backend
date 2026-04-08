const nodemailer = require("nodemailer");
const { EMAIL_USER, EMAIL_PASS } = require('./config');

// Create a transporter using your email service provider's SMTP settings
const transporter = nodemailer.createTransport({
    service: "gmail", // e.g., Gmail, Outlook, etc.
    auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS  // Your email password or app-specific password
    }
}); 

const sendEmail = async (to, subject, text) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            text
        };

      const  info =  await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
};

module.exports = sendEmail;