const tutorials = require("../controllers/tutorial.controller.js");
const { isAuthenticated } = require("../middleware/auth.middleware");
const router = require("express").Router();

// All routes require authentication
router.use(isAuthenticated);

// Create a new Tutorial
router.post("/", tutorials.create);

// Retrieve all Tutorials
router.get("/", tutorials.findAll);

// Retrieve all published Tutorials
router.get("/published", tutorials.findAllPublished);

// Retrieve a single Tutorial with id
router.get("/:id", tutorials.findOne);

// Update a Tutorial with id
router.put("/:id", tutorials.update);

// Delete a Tutorial with id
router.delete("/:id", tutorials.delete);

// Delete all Tutorials
router.delete("/", tutorials.deleteAll);

// Export the router directly (not a function)
module.exports = router;