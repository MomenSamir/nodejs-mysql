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

  // Get all with search, filter, and pagination
  static async getAll(options = {}) {
    try {
      const { title, published, page = 1, limit = 10 } = options;
      
      let query = "SELECT * FROM tutorials WHERE 1=1";
      const params = [];

      // Search by title
      if (title) {
        query += " AND title LIKE ?";
        params.push(`%${title}%`);
      }

      // Filter by published status
      if (published !== undefined && published !== null && published !== '') {
        query += " AND published = ?";
        params.push(published === 'true' || published === true ? 1 : 0);
      }

      // Count total results (before pagination)
      const countQuery = query.replace("SELECT *", "SELECT COUNT(*) as total");
      const [countResult] = await sql.query(countQuery, params);
      const total = countResult[0].total;

      // Add sorting
      query += " ORDER BY created_at DESC";

      // Add pagination
      const offset = (page - 1) * limit;
      query += " LIMIT ? OFFSET ?";
      params.push(parseInt(limit), parseInt(offset));

      const [rows] = await sql.query(query, params);
      
      return {
        tutorials: rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: total,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (err) {
      console.error("Error in getAll:", err);
      throw err;
    }
  }

  // Get all published
  static async getAllPublished() {
    try {
      const [rows] = await sql.query("SELECT * FROM tutorials WHERE published = 1 ORDER BY created_at DESC");
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
      
      const [res] = await sql.query(
        "UPDATE tutorials SET title = ?, description = ?, published = ?, image = ? WHERE id = ?",
        [tutorial.title, tutorial.description, publishedValue, tutorial.image, id]
      );
      
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