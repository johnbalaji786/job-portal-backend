const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send('Welcome to the Job Portal API');
});

module.exports = app;