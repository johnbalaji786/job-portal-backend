const { register, login, getMe, logout } = require("../controllers/authController");
const express = require("express");
const { isAuthenticated } = require("../middleware/auth");
const upload = require("../middleware/upload");
const User = require('../models/user');

const authrouter = express.Router();
// public routes
authrouter.post("/register", register);
authrouter.post("/login", login);

//protected routes
authrouter.get("/getMe", isAuthenticated, getMe);
authrouter.post("/logout", isAuthenticated, logout);

authrouter.post('/upload/profile-picture', isAuthenticated, upload.single('profilePicture'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const user = await User.findByIdAndUpdate(req.userId, { profilePicture: req.file.path }, { new: true }).select('-password');

        res.status(200).json({ success: true, message: 'Profile picture uploaded successfully', user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error uploading profile picture', error: error.message });
    }
});

authrouter.post('/upload/resume', isAuthenticated, upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const user = await User.findByIdAndUpdate(req.userId, { resume: req.file.path }, { new: true }).select('-password');

        res.status(200).json({ success: true, message: 'Resume uploaded successfully', user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error uploading resume', error: error.message });
    }
});

module.exports = authrouter;