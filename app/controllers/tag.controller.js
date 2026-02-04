const Tag = require("../models/tag.model");

// Create a new Tag
exports.create = async (req, res) => {
  // Validate request
  if (!req.body.name) {
    return res.status(400).send({
      message: "Tag name cannot be empty!"
    });
  }

  // Generate slug from name
  const slug = req.body.slug || req.body.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  const tag = {
    name: req.body.name,
    slug: slug
  };

  try {
    const data = await Tag.create(tag);
    res.status(201).send(data);
  } catch (err) {
    if (err.kind === "duplicate") {
      return res.status(400).send({
        message: `Tag with this ${err.field} already exists!`
      });
    }
    res.status(500).send({
      message: err.message || "Error occurred while creating tag."
    });
  }
};

// Retrieve all Tags
exports.findAll = async (req, res) => {
  try {
    const withCount = req.query.withCount === 'true';
    const data = withCount 
      ? await Tag.getAllWithCount()
      : await Tag.getAll();
    res.send(data);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Error occurred while retrieving tags."
    });
  }
};

// Find a single Tag by id
exports.findOne = async (req, res) => {
  try {
    const data = await Tag.findById(req.params.id);
    res.send(data);
  } catch (err) {
    if (err.kind === "not_found") {
      return res.status(404).send({
        message: `Tag not found with id ${req.params.id}.`
      });
    }
    res.status(500).send({
      message: "Error retrieving tag with id " + req.params.id
    });
  }
};

// Update a Tag by id
exports.update = async (req, res) => {
  if (!req.body.name) {
    return res.status(400).send({
      message: "Tag name cannot be empty!"
    });
  }

  // Generate slug from name
  const slug = req.body.slug || req.body.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  const tag = {
    name: req.body.name,
    slug: slug
  };

  try {
    const data = await Tag.updateById(req.params.id, tag);
    res.send(data);
  } catch (err) {
    if (err.kind === "not_found") {
      return res.status(404).send({
        message: `Tag not found with id ${req.params.id}.`
      });
    }
    if (err.kind === "duplicate") {
      return res.status(400).send({
        message: `Tag with this ${err.field} already exists!`
      });
    }
    res.status(500).send({
      message: "Error updating tag with id " + req.params.id
    });
  }
};

// Delete a Tag by id
exports.delete = async (req, res) => {
  try {
    await Tag.remove(req.params.id);
    res.send({ message: "Tag deleted successfully!" });
  } catch (err) {
    if (err.kind === "not_found") {
      return res.status(404).send({
        message: `Tag not found with id ${req.params.id}.`
      });
    }
    res.status(500).send({
      message: "Could not delete tag with id " + req.params.id
    });
  }
};

// Get popular tags (most used)
exports.getPopular = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const tags = await Tag.getAllWithCount();
    const popular = tags.slice(0, limit);
    res.send(popular);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Error occurred while retrieving popular tags."
    });
  }
};