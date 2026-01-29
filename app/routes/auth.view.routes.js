const express = require("express");
const { isNotAuthenticated } = require("../middleware/auth.middleware");
const router = express.Router();

// Login page
router.get("/login", isNotAuthenticated, (req, res) => {
  res.render("auth/login");
});

// Register page
router.get("/register", isNotAuthenticated, (req, res) => {
  res.render("auth/register");
});

module.exports = router;