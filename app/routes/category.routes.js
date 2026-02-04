const categories = require("../controllers/category.controller");
const { isAuthenticated } = require("../middleware/auth.middleware");
const router = require("express").Router();

// All routes require authentication
router.use(isAuthenticated);

// Create a new Category
router.post("/", categories.create);

// Retrieve all Categories
router.get("/", categories.findAll);

// Retrieve a single Category with id
router.get("/:id", categories.findOne);

// Update a Category with id
router.put("/:id", categories.update);

// Delete a Category with id
router.delete("/:id", categories.delete);

module.exports = router;