const tutorials = require("../controllers/tutorial.controller.js");
const { isAuthenticated } = require("../middleware/auth.middleware");
const upload = require("../config/upload.config");
const router = require("express").Router();

// All routes require authentication
router.use(isAuthenticated);

// Create a new Tutorial (with image upload)
router.post("/", upload.single('image'), tutorials.create);

// Retrieve all Tutorials
router.get("/", tutorials.findAll);

// Retrieve all published Tutorials
router.get("/published", tutorials.findAllPublished);

// Retrieve a single Tutorial with id
router.get("/:id", tutorials.findOne);

// Update a Tutorial with id (with image upload)
router.put("/:id", upload.single('image'), tutorials.update);

// Delete a Tutorial with id
router.delete("/:id", tutorials.delete);

// Delete all Tutorials
router.delete("/", tutorials.deleteAll);

module.exports = router;