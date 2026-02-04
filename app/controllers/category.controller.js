const Tutorial = require("../models/tutorial.model.js");
const Tag = require("../models/tag.model.js");
const fs = require('fs');
const path = require('path');

// Create and Save a new Tutorial
exports.create = async (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({
      message: "Title cannot be empty!"
    });
    return;
  }

  try {
    // Create a Tutorial
    const tutorial = {
      title: req.body.title,
      description: req.body.description,
      published: req.body.published || false,
      image: req.file ? `/uploads/tutorials/${req.file.filename}` : null,
      category_id: req.body.category_id || null
    };

    // Save Tutorial in the database
    const data = await Tutorial.create(tutorial);

    // Handle tags (if provided)
    if (req.body.tags) {
      const tagNames = typeof req.body.tags === 'string' 
        ? req.body.tags.split(',').map(t => t.trim()).filter(Boolean)
        : req.body.tags;
      
      const tagIds = [];
      for (const tagName of tagNames) {
        const tag = await Tag.findOrCreate(tagName);
        tagIds.push(tag.id);
      }
      
      if (tagIds.length > 0) {
        await Tag.syncTutorialTags(data.id, tagIds);
      }
    }

    res.send(data);
  } catch (err) {
    console.error("CREATE ERROR:", err);
    res.status(500).send({
      message: err.message || "Some error occurred while creating the Tutorial."
    });
  }
};

// Retrieve all Tutorials with search, filter, and pagination
exports.findAll = async (req, res) => {
  const options = {
    title: req.query.title,
    published: req.query.published,
    category: req.query.category,
    tag: req.query.tag,
    page: req.query.page || 1,
    limit: req.query.limit || 10
  };

  try {
    const data = await Tutorial.getAll(options);
    res.send(data);
  } catch (err) {
    console.error("FIND ALL ERROR:", err);
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving tutorials."
    });
  }
};

// Find a single Tutorial with an id
exports.findOne = async (req, res) => {
  try {
    const data = await Tutorial.findById(req.params.id);
    res.send(data);
  } catch (err) {
    console.error("FIND ONE ERROR:", err);
    if (err.kind === "not_found") {
      res.status(404).send({
        message: `Not found Tutorial with id ${req.params.id}.`
      });
    } else {
      res.status(500).send({
        message: "Error retrieving Tutorial with id " + req.params.id
      });
    }
  }
};

// Find all published Tutorials
exports.findAllPublished = async (req, res) => {
  try {
    const data = await Tutorial.getAllPublished();
    res.send(data);
  } catch (err) {
    console.error("FIND PUBLISHED ERROR:", err);
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving tutorials."
    });
  }
};

// Update a Tutorial identified by the id in the request
exports.update = async (req, res) => {
  // Validate Request
  if (!req.body) {
    return res.status(400).send({
      message: "Content cannot be empty!"
    });
  }

  try {
    // Get old tutorial to check for existing image
    const oldTutorial = await Tutorial.findById(req.params.id);

    // Determine image value
    let imageValue;
    if (req.file) {
      // New file uploaded
      imageValue = `/uploads/tutorials/${req.file.filename}`;
    } else if (req.body.image) {
      // Keep existing image
      imageValue = req.body.image;
    } else {
      // Keep old tutorial's image
      imageValue = oldTutorial.image;
    }

    const tutorial = {
      title: req.body.title,
      description: req.body.description,
      published: req.body.published === 'true' || req.body.published === true,
      image: imageValue,
      category_id: req.body.category_id || null
    };

    const data = await Tutorial.updateById(req.params.id, tutorial);

    // Handle tags (if provided)
    if (req.body.tags !== undefined) {
      const tagNames = typeof req.body.tags === 'string' 
        ? req.body.tags.split(',').map(t => t.trim()).filter(Boolean)
        : (Array.isArray(req.body.tags) ? req.body.tags : []);
      
      const tagIds = [];
      for (const tagName of tagNames) {
        if (tagName) {
          const tag = await Tag.findOrCreate(tagName);
          tagIds.push(tag.id);
        }
      }
      
      await Tag.syncTutorialTags(req.params.id, tagIds);
    }

    // Delete old image if new image was uploaded
    if (req.file && oldTutorial.image && oldTutorial.image !== imageValue) {
      const oldImagePath = path.join(__dirname, '../../public', oldTutorial.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    res.send(data);
  } catch (err) {
    console.error("UPDATE ERROR FULL:", err);
    
    if (err.kind === "not_found") {
      return res.status(404).send({
        message: `Not found Tutorial with id ${req.params.id}.`
      });
    }
    
    res.status(500).send({
      message: "Error updating Tutorial with id " + req.params.id,
      error: err.message
    });
  }
};

// Delete a Tutorial with the specified id in the request
exports.delete = async (req, res) => {
  try {
    // Get tutorial to find image path
    const tutorial = await Tutorial.findById(req.params.id);
    
    // Delete tutorial (tags will be deleted automatically via CASCADE)
    await Tutorial.remove(req.params.id);
    
    // Delete image file if exists
    if (tutorial.image) {
      const imagePath = path.join(__dirname, '../../public', tutorial.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    res.send({ message: "Tutorial was deleted successfully!" });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    if (err.kind === "not_found") {
      res.status(404).send({
        message: `Not found Tutorial with id ${req.params.id}.`
      });
    } else {
      res.status(500).send({
        message: "Could not delete Tutorial with id " + req.params.id
      });
    }
  }
};

// Delete all Tutorials from the database
exports.deleteAll = async (req, res) => {
  try {
    const data = await Tutorial.removeAll();
    res.send({ message: `${data.affectedRows} Tutorials were deleted successfully!` });
  } catch (err) {
    console.error("DELETE ALL ERROR:", err);
    res.status(500).send({
      message: err.message || "Some error occurred while removing all tutorials."
    });
  }
};