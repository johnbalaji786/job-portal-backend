const express = require('express');

const app = express();

//middleware to parse JSON bodies in incoming requests   
app.use(express.json());

app.use('/api/v1/auth', require('./routes/authRoutes'));

module.exports = app;