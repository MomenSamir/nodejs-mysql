const sql = require("./db.js");
const Tag = require("./tag.model.js");

class Tutorial {
  constructor(tutorial) {
    this.title = tutorial.title;
    this.description = tutorial.description;
    this.published = tutorial.published || false;
    this.image = tutorial.image || null;
    this.category_id = tutorial.category_id || null;
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

  // Find by Id with category and tags
  static async findById(id) {
    try {
      // Get tutorial
      const [rows] = await sql.query("SELECT * FROM tutorials WHERE id = ?", [id]);
      if (!rows.length) throw { kind: "not_found" };
      
      const tutorial = rows[0];
      
      // Get category
      if (tutorial.category_id) {
        const [category] = await sql.query(
          "SELECT * FROM categories WHERE id = ?",
          [tutorial.category_id]
        );
        tutorial.category = category[0] || null;
      } else {
        tutorial.category = null;
      }
      
      // Get tags
      tutorial.tags = await Tag.getByTutorialId(id);
      
      return tutorial;
    } catch (err) {
      throw err;
    }
  }

  // Get all with search, filter, and pagination
  static async getAll(options = {}) {
    try {
      const { title, published, category, tag, page = 1, limit = 10 } = options;
      
      let query = `
        SELECT DISTINCT t.*, c.name as category_name
        FROM tutorials t
        LEFT JOIN categories c ON t.category_id = c.id
      `;
      
      const params = [];
      const conditions = [];

      // Search by title
      if (title) {
        conditions.push("t.title LIKE ?");
        params.push(`%${title}%`);
      }

      // Filter by published status
      if (published !== undefined && published !== null && published !== '') {
        conditions.push("t.published = ?");
        params.push(published === 'true' || published === true ? 1 : 0);
      }

      // Filter by category
      if (category) {
        conditions.push("t.category_id = ?");
        params.push(category);
      }

      // Filter by tag (requires join)
      if (tag) {
        query += " INNER JOIN tutorial_tags tt ON t.id = tt.tutorial_id";
        conditions.push("tt.tag_id = ?");
        params.push(tag);
      }

      // Add WHERE conditions
      if (conditions.length > 0) {
        query += " WHERE " + conditions.join(" AND ");
      }

      // Count total results (before pagination)
      const countQuery = query.replace(
        "SELECT DISTINCT t.*, c.name as category_name",
        "SELECT COUNT(DISTINCT t.id) as total"
      );
      const [countResult] = await sql.query(countQuery, params);
      const total = countResult[0].total;

      // Add sorting
      query += " ORDER BY t.created_at DESC";

      // Add pagination
      const offset = (page - 1) * limit;
      query += " LIMIT ? OFFSET ?";
      params.push(parseInt(limit), parseInt(offset));

      const [rows] = await sql.query(query, params);
      
      // Get tags for each tutorial
      for (const tutorial of rows) {
        tutorial.tags = await Tag.getByTutorialId(tutorial.id);
      }
      
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
      const [rows] = await sql.query(`
        SELECT t.*, c.name as category_name
        FROM tutorials t
        LEFT JOIN categories c ON t.category_id = c.id
        WHERE t.published = 1
        ORDER BY t.created_at DESC
      `);
      
      // Get tags for each tutorial
      for (const tutorial of rows) {
        tutorial.tags = await Tag.getByTutorialId(tutorial.id);
      }
      
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
        "UPDATE tutorials SET title = ?, description = ?, published = ?, image = ?, category_id = ? WHERE id = ?",
        [tutorial.title, tutorial.description, publishedValue, tutorial.image, tutorial.category_id, id]
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
      // Tutorial_tags will be automatically deleted due to ON DELETE CASCADE
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