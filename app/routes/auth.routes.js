const auth = require("../controllers/auth.controller");
const { isAuthenticated } = require("../middleware/auth.middleware");
const router = require("express").Router();

// Register a new user
router.post("/register", auth.register);

// Login
router.post("/login", auth.login);

// Logout (protected route)
router.post("/logout", isAuthenticated, auth.logout);

// Get current user (protected route)
router.get("/me", isAuthenticated, auth.getCurrentUser);

module.exports = router;