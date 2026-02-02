const express = require("express");
const Tutorial = require("../models/tutorial.model.js");
const { isAuthenticated } = require("../middleware/auth.middleware");

const router = express.Router();

// All routes require authentication
router.use(isAuthenticated);

// List with search and filters
router.get("/tutorials", async (req, res) => {
  try {
    const options = {
      title: req.query.search,
      published: req.query.status,
      page: req.query.page || 1,
      limit: 10
    };

    const result = await Tutorial.getAll(options);
    
    res.render("tutorials/index", {
      tutorials: result.tutorials,
      pagination: result.pagination,
      filters: {
        search: req.query.search || '',
        status: req.query.status || ''
      }
    });
  } catch (err) {
    console.error("Error loading tutorials:", err);
    res.status(500).send("Error loading tutorials");
  }
});

// Create form
router.get("/tutorials/create", (req, res) => {
  res.render("tutorials/create");
});

// Edit form
router.get("/tutorials/:id/edit", async (req, res) => {
  try {
    const tutorial = await Tutorial.findById(req.params.id);
    res.render("tutorials/edit", { tutorial });
  } catch (err) {
    console.error("Error loading tutorial:", err);
    res.status(404).send("Tutorial not found");
  }
});

module.exports = router;