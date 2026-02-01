const auth = require("../controllers/auth.controller");
const { isAuthenticated } = require("../middleware/auth.middleware");
const router = require("express").Router();

// Public routes (no authentication required)
router.post("/register", auth.register);
router.post("/login", auth.login);

// Protected routes (authentication required)
router.post("/logout", isAuthenticated, auth.logout);
router.get("/me", isAuthenticated, auth.getCurrentUser);

module.exports = router;