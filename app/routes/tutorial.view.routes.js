const express = require("express");
const Tutorial = require("../models/tutorial.model.js");

const router = express.Router();

// List
router.get("/tutorials", async (req, res) => {
  const tutorials = await Tutorial.getAll();
  res.render("tutorials/index", { tutorials });
});

// Create form
router.get("/tutorials/create", (req, res) => {
  res.render("tutorials/create");
});

// Edit form
router.get("/tutorials/:id/edit", async (req, res) => {
  const tutorial = await Tutorial.findById(req.params.id);
  res.render("tutorials/edit", { tutorial });
});

// Export the router
module.exports = router;