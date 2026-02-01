const Tutorial = require("../models/tutorial.model.js");
const fs = require('fs');
const path = require('path');

// Create and Save a new Tutorial
exports.create = (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({
      message: "Title cannot be empty!"
    });
    return;
  }

  // Create a Tutorial
  const tutorial = new Tutorial({
    title: req.body.title,
    description: req.body.description,
    published: req.body.published || false,
    image: req.file ? `/uploads/tutorials/${req.file.filename}` : null
  });

  // Save Tutorial in the database
  Tutorial.create(tutorial)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Tutorial."
      });
    });
};

// Retrieve all Tutorials from the database
exports.findAll = (req, res) => {
  const title = req.query.title;

  Tutorial.getAll(title)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving tutorials."
      });
    });
};

// Find a single Tutorial with an id
exports.findOne = (req, res) => {
  Tutorial.findById(req.params.id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Tutorial with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Tutorial with id " + req.params.id
        });
      }
    });
};

// Find all published Tutorials
exports.findAllPublished = (req, res) => {
  Tutorial.getAllPublished()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving tutorials."
      });
    });
};

// Update a Tutorial identified by the id in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content cannot be empty!"
    });
  }

  // Get old tutorial to check for existing image
  Tutorial.findById(req.params.id)
    .then(oldTutorial => {
      const tutorial = new Tutorial({
        title: req.body.title,
        description: req.body.description,
        published: req.body.published || false,
        image: req.file ? `/uploads/tutorials/${req.file.filename}` : (req.body.image || oldTutorial.image)
      });

      Tutorial.updateById(req.params.id, tutorial)
        .then(data => {
          // Delete old image if new image was uploaded
          if (req.file && oldTutorial.image) {
            const oldImagePath = path.join(__dirname, '../../public', oldTutorial.image);
            if (fs.existsSync(oldImagePath)) {
              fs.unlinkSync(oldImagePath);
            }
          }
          res.send(data);
        })
        .catch(err => {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found Tutorial with id ${req.params.id}.`
            });
          } else {
            res.status(500).send({
              message: "Error updating Tutorial with id " + req.params.id
            });
          }
        });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error finding Tutorial with id " + req.params.id
      });
    });
};

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {
  // Get tutorial to find image path
  Tutorial.findById(req.params.id)
    .then(tutorial => {
      Tutorial.remove(req.params.id)
        .then(data => {
          // Delete image file if exists
          if (tutorial.image) {
            const imagePath = path.join(__dirname, '../../public', tutorial.image);
            if (fs.existsSync(imagePath)) {
              fs.unlinkSync(imagePath);
            }
          }
          res.send({ message: "Tutorial was deleted successfully!" });
        })
        .catch(err => {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found Tutorial with id ${req.params.id}.`
            });
          } else {
            res.status(500).send({
              message: "Could not delete Tutorial with id " + req.params.id
            });
          }
        });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error finding Tutorial with id " + req.params.id
      });
    });
};

// Delete all Tutorials from the database
exports.deleteAll = (req, res) => {
  Tutorial.removeAll()
    .then(data => {
      res.send({ message: `${data.affectedRows} Tutorials were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all tutorials."
      });
    });
};