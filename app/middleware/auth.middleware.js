// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    // User is logged in
    return next();
  }
  
  // User is not logged in
  // If it's an API request, return JSON error
  if (req.path.startsWith('/api')) {
    return res.status(401).json({ message: "Unauthorized. Please login." });
  }
  
  // If it's a page request, redirect to login
  return res.redirect('/login');
};

// Middleware to check if user is NOT authenticated (for login/register pages)
const isNotAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    // User is already logged in, redirect to home
    return res.redirect('/tutorials');
  }
  return next();
};

// Middleware to attach user info to all views
const attachUser = async (req, res, next) => {
  if (req.session && req.session.userId) {
    try {
      const User = require("../models/user.model");
      const user = await User.findById(req.session.userId);
      res.locals.currentUser = user;
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  } else {
    res.locals.currentUser = null;
  }
  next();
};

module.exports = {
  isAuthenticated,
  isNotAuthenticated,
  attachUser
};