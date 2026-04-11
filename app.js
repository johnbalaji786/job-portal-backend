const express = require('express');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');

const app = express();

//middleware to parse JSON bodies in incoming requests   
app.use(express.json());

//middleware to parse cookies in incoming requests
app.use(cookieParser());

app.use('/api/v1/auth', authRoutes);

module.exports = app;