const Category = require("../models/category.model");

// Create a new Category
exports.create = async (req, res) => {
  // Validate request
  if (!req.body.name) {
    return res.status(400).send({
      message: "Category name cannot be empty!"
    });
  }

  // Generate slug from name
  const slug = req.body.slug || req.body.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  const category = {
    name: req.body.name,
    slug: slug,
    description: req.body.description || null
  };

  try {
    const data = await Category.create(category);
    res.status(201).send(data);
  } catch (err) {
    if (err.kind === "duplicate") {
      return res.status(400).send({
        message: `Category with this ${err.field} already exists!`
      });
    }
    res.status(500).send({
      message: err.message || "Error occurred while creating category."
    });
  }
};

// Retrieve all Categories
exports.findAll = async (req, res) => {
  try {
    const withCount = req.query.withCount === 'true';
    const data = withCount 
      ? await Category.getAllWithCount()
      : await Category.getAll();
    res.send(data);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Error occurred while retrieving categories."
    });
  }
};

// Find a single Category by id
exports.findOne = async (req, res) => {
  try {
    const data = await Category.findById(req.params.id);
    res.send(data);
  } catch (err) {
    if (err.kind === "not_found") {
      return res.status(404).send({
        message: `Category not found with id ${req.params.id}.`
      });
    }
    res.status(500).send({
      message: "Error retrieving category with id " + req.params.id
    });
  }
};

// Update a Category by id
exports.update = async (req, res) => {
  if (!req.body.name) {
    return res.status(400).send({
      message: "Category name cannot be empty!"
    });
  }

  // Generate slug from name
  const slug = req.body.slug || req.body.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  const category = {
    name: req.body.name,
    slug: slug,
    description: req.body.description || null
  };

  try {
    const data = await Category.updateById(req.params.id, category);
    res.send(data);
  } catch (err) {
    if (err.kind === "not_found") {
      return res.status(404).send({
        message: `Category not found with id ${req.params.id}.`
      });
    }
    if (err.kind === "duplicate") {
      return res.status(400).send({
        message: `Category with this ${err.field} already exists!`
      });
    }
    res.status(500).send({
      message: "Error updating category with id " + req.params.id
    });
  }
};

// Delete a Category by id
exports.delete = async (req, res) => {
  try {
    await Category.remove(req.params.id);
    res.send({ message: "Category deleted successfully!" });
  } catch (err) {
    if (err.kind === "not_found") {
      return res.status(404).send({
        message: `Category not found with id ${req.params.id}.`
      });
    }
    res.status(500).send({
      message: "Could not delete category with id " + req.params.id
    });
  }
};