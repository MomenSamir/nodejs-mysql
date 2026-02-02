const sql = require("./db.js");

class Tutorial {
  constructor(tutorial) {
    this.title = tutorial.title;
    this.description = tutorial.description;
    this.published = tutorial.published || false;
    this.image = tutorial.image || null;
  }

  // Create a new Tutorial
  static async create(newTutorial) {
    try {
      // Convert published to boolean/integer
      const tutorialData = {
        ...newTutorial,
        published: newTutorial.published === true || newTutorial.published === 'true' ? 1 : 0
      };
      
      const [res] = await sql.query("INSERT INTO tutorials SET ?", tutorialData);
      return { id: res.insertId, ...newTutorial };
    } catch (err) {
      console.error("Error creating tutorial:", err);
      throw err;
    }
  }

  // Find by Id
  static async findById(id) {
    try {
      const [rows] = await sql.query("SELECT * FROM tutorials WHERE id = ?", [id]);
      if (rows.length) return rows[0];
      const error = { kind: "not_found" };
      throw error;
    } catch (err) {
      throw err;
    }
  }

  // Get all
  static async getAll(title) {
    try {
      let query = "SELECT * FROM tutorials";
      const params = [];
      if (title) {
        query += " WHERE title LIKE ?";
        params.push(`%${title}%`);
      }
      const [rows] = await sql.query(query, params);
      return rows;
    } catch (err) {
      throw err;
    }
  }

  // Get all published
  static async getAllPublished() {
    try {
      const [rows] = await sql.query("SELECT * FROM tutorials WHERE published = true");
      return rows;
    } catch (err) {
      throw err;
    }
  }

  // Update by Id
  static async updateById(id, tutorial) {
    try {
      // Convert published to integer (MySQL boolean)
      const publishedValue = tutorial.published === true || tutorial.published === 'true' ? 1 : 0;
      
      console.log("Model updateById - Converting published:", tutorial.published, "->", publishedValue);
      
      const [res] = await sql.query(
        "UPDATE tutorials SET title = ?, description = ?, published = ?, image = ? WHERE id = ?",
        [tutorial.title, tutorial.description, publishedValue, tutorial.image, id]
      );
      
      console.log("Model updateById - affectedRows:", res.affectedRows);
      
      if (res.affectedRows === 0) throw { kind: "not_found" };
      return { id, ...tutorial, published: publishedValue };
    } catch (err) {
      console.error("Model updateById - Error:", err);
      throw err;
    }
  }

  // Delete by Id
  static async remove(id) {
    try {
      const [res] = await sql.query("DELETE FROM tutorials WHERE id = ?", [id]);
      if (res.affectedRows === 0) throw { kind: "not_found" };
      return res;
    } catch (err) {
      throw err;
    }
  }

  // Delete all
  static async removeAll() {
    try {
      const [res] = await sql.query("DELETE FROM tutorials");
      return res;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Tutorial;