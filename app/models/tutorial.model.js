const sql = require("./db.js"); // promise-based pool

class Tutorial {
  constructor(tutorial) {
    this.title = tutorial.title;
    this.description = tutorial.description;
    this.published = tutorial.published || false;
  }

  // Create a new Tutorial
  static async create(newTutorial) {
    try {
      const [res] = await sql.query("INSERT INTO tutorials SET ?", newTutorial);
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
      const [res] = await sql.query(
        "UPDATE tutorials SET title = ?, description = ?, published = ? WHERE id = ?",
        [tutorial.title, tutorial.description, tutorial.published, id]
      );
      if (res.affectedRows === 0) throw { kind: "not_found" };
      return { id, ...tutorial };
    } catch (err) {
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
