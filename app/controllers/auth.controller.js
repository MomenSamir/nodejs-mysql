const User = require("../models/user.model");

// Register a new user
exports.register = async (req, res) => {
  // Validate request
  if (!req.body.username || !req.body.email || !req.body.password) {
    return res.status(400).json({
      message: "Username, email, and password are required!"
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(req.body.email)) {
    return res.status(400).json({
      message: "Invalid email format!"
    });
  }

  // Validate password length
  if (req.body.password.length < 6) {
    return res.status(400).json({
      message: "Password must be at least 6 characters!"
    });
  }

  // Create a User
  const user = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  };

  try {
    const data = await User.create(user);
    
    // Automatically log the user in after registration
    req.session.userId = data.id;
    req.session.username = data.username;
    
    // IMPORTANT: Save session before sending response
    req.session.save((err) => {
      if (err) {
        console.error("Session save error:", err);
        return res.status(500).json({
          message: "Error saving session"
        });
      }
      
      res.status(201).json({
        message: "User registered successfully!",
        user: {
          id: data.id,
          username: data.username,
          email: data.email
        }
      });
    });
  } catch (err) {
    if (err.kind === "duplicate") {
      return res.status(400).json({
        message: `${err.field} already exists!`
      });
    }
    res.status(500).json({
      message: err.message || "Error occurred while registering user."
    });
  }
};

// Login user
exports.login = async (req, res) => {
  // Validate request
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({
      message: "Email and password are required!"
    });
  }

  try {
    // Find user by email
    const user = await User.findByEmail(req.body.email);
    
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password!"
      });
    }

    // Verify password
    const isPasswordValid = await User.verifyPassword(req.body.password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password!"
      });
    }

    // Create session
    req.session.userId = user.id;
    req.session.username = user.username;

    // IMPORTANT: Save session before sending response
    req.session.save((err) => {
      if (err) {
        console.error("Session save error:", err);
        return res.status(500).json({
          message: "Error saving session"
        });
      }
      
      res.json({
        message: "Login successful!",
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      });
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || "Error occurred while logging in."
    });
  }
};

// Logout user
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        message: "Error occurred while logging out."
      });
    }
    res.json({
      message: "Logout successful!"
    });
  });
};

// Get current user info
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found!"
      });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({
      message: err.message || "Error retrieving user."
    });
  }
};