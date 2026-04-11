const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/config'); // 👈 fix this also
const User = require('../models/user'); // 👈 if middleware outside

const isAuthenticated = (req, res, next) => {
    // Check for the token in the request headers or cookies
    const token = req.cookies && req.cookies.token;

    // If no token is found, return an error
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

   try {
        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId; // Attach the decoded user information to the request object
        next(); // Proceed to the next middleware or route handler
       
    } catch (error) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};

const allowRoles = (...roles) => {
         return async (req, res, next) => {
        // get the userId from the request object
        const userId = req.userId;

        // get the user's role from the database
        const user = await User.findById(userId).select('-password');

        // check if the user exists
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // check if the user's role is in the allowed roles
        if (!roles.includes(user.role)) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        // add the user object to the request object
        req.user = user;

        // call the next middleware or route handler
        next();
    }        

};
module.exports = {
    isAuthenticated,
    allowRoles
};
