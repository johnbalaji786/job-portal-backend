const { register, login, getMe, logout } = require("../controllers/authController");
const express = require("express");
const { isAuthenticated } = require("../middleware/auth");

const authrouter = express.Router();
// public routes
authrouter.post("/register", register);
authrouter.post("/login", login);

//protected routes
authrouter.get("/getMe", isAuthenticated, getMe);
authrouter.post("/logout", isAuthenticated,logout);

module.exports = authrouter;