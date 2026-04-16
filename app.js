const express = require('express');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const errorRoute = require('./middleware/errorRoute');
const logger = require('./middleware/logger');


const app = express();

//middleware to parse JSON bodies in incoming requests   
app.use(express.json());

//middleware to parse cookies in incoming requests
app.use(cookieParser());

//custom logger middleware
app.use(logger);

app.use('/api/v1/auth', authRoutes);

// catch-all route for handling 404 errors
app.use(errorRoute);
module.exports = app;