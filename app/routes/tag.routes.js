const tags = require("../controllers/tag.controller");
const { isAuthenticated } = require("../middleware/auth.middleware");
const router = require("express").Router();

// All routes require authentication
router.use(isAuthenticated);

// Create a new Tag
router.post("/", tags.create);

// Retrieve all Tags
router.get("/", tags.findAll);

// Get popular tags
router.get("/popular", tags.getPopular);

// Retrieve a single Tag with id
router.get("/:id", tags.findOne);

// Update a Tag with id
router.put("/:id", tags.update);

// Delete a Tag with id
router.delete("/:id", tags.delete);

module.exports = router;