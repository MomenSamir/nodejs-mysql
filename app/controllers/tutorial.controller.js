const Tutorial = require("../models/tutorial.model.js");

// Create
exports.create = async (req, res) => {
  if (!req.body) return res.status(400).send({ message: "Content can not be empty!" });

  const tutorial = new Tutorial(req.body); // instance

  try {
    const data = await Tutorial.create(tutorial);
    res.send(data);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};


// Retrieve all Tutorials
exports.findAll = async (req, res) => {
  const title = req.query.title;

  try {
    const tutorials = await Tutorial.getAll(title);
    res.send(tutorials);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving tutorials."
    });
  }
};

// Retrieve all published Tutorials
exports.findAllPublished = async (req, res) => {
  try {
    const tutorials = await Tutorial.getAllPublished();
    res.send(tutorials);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving tutorials."
    });
  }
};

// Retrieve a single Tutorial by Id
exports.findOne = async (req, res) => {
  try {
    const tutorial = await Tutorial.findById(req.params.id);
    res.send(tutorial);
  } catch (err) {
    if (err.kind === "not_found") {
      res.status(404).send({ message: `Not found Tutorial with id ${req.params.id}.` });
    } else {
      res.status(500).send({ message: "Error retrieving Tutorial with id " + req.params.id });
    }
  }
};

// Update a Tutorial
exports.update = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({ message: "Content can not be empty!" });
  }

  try {
    const data = await Tutorial.updateById(req.params.id, new Tutorial(req.body));
    res.send(data);
  } catch (err) {
    if (err.kind === "not_found") {
      res.status(404).send({ message: `Not found Tutorial with id ${req.params.id}.` });
    } else {
      res.status(500).send({ message: "Error updating Tutorial with id " + req.params.id });
    }
  }
};

// Delete a Tutorial
exports.delete = async (req, res) => {
  try {
    await Tutorial.remove(req.params.id);
    res.send({ message: `Tutorial was deleted successfully!` });
  } catch (err) {
    if (err.kind === "not_found") {
      res.status(404).send({ message: `Not found Tutorial with id ${req.params.id}.` });
    } else {
      res.status(500).send({ message: "Could not delete Tutorial with id " + req.params.id });
    }
  }
};

// Delete all Tutorials
exports.deleteAll = async (req, res) => {
  try {
    await Tutorial.removeAll();
    res.send({ message: `All Tutorials were deleted successfully!` });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while removing all tutorials."
    });
  }
};
