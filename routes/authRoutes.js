const { register } = require("../controllers/authController");
const express = require("express");

const authrouter = express.Router();

authrouter.post("/register", register);

module.exports = authrouter;