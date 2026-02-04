const sql = require("./db.js");

class Category {
  constructor(category) {
    this.name = category.name;
    this.slug = category.slug;
    this.description = category.description;
  }

  // Create a new Category
  static async create(newCategory) {
    try {
      const [res] = await sql.query("INSERT INTO categories SET ?", newCategory);
      return { id: res.insertId, ...newCategory };
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        throw { kind: "duplicate", field: "name or slug" };
      }
      console.error("Error creating category:", err);
      throw err;
    }
  }

  // Find by Id
  static async findById(id) {
    try {
      const [rows] = await sql.query("SELECT * FROM categories WHERE id = ?", [id]);
      if (rows.length) return rows[0];
      throw { kind: "not_found" };
    } catch (err) {
      throw err;
    }
  }

  // Find by Slug
  static async findBySlug(slug) {
    try {
      const [rows] = await sql.query("SELECT * FROM categories WHERE slug = ?", [slug]);
      if (rows.length) return rows[0];
      return null;
    } catch (err) {
      throw err;
    }
  }

  // Get all categories
  static async getAll() {
    try {
      const [rows] = await sql.query("SELECT * FROM categories ORDER BY name ASC");
      return rows;
    } catch (err) {
      throw err;
    }
  }

  // Get category with tutorial count
  static async getAllWithCount() {
    try {
      const query = `
        SELECT c.*, COUNT(t.id) as tutorial_count
        FROM categories c
        LEFT JOIN tutorials t ON c.id = t.category_id
        GROUP BY c.id
        ORDER BY c.name ASC
      `;
      const [rows] = await sql.query(query);
      return rows;
    } catch (err) {
      throw err;
    }
  }

  // Update by Id
  static async updateById(id, category) {
    try {
      const [res] = await sql.query(
        "UPDATE categories SET name = ?, slug = ?, description = ? WHERE id = ?",
        [category.name, category.slug, category.description, id]
      );
      if (res.affectedRows === 0) throw { kind: "not_found" };
      return { id, ...category };
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        throw { kind: "duplicate", field: "name or slug" };
      }
      throw err;
    }
  }

  // Delete by Id
  static async remove(id) {
    try {
      const [res] = await sql.query("DELETE FROM categories WHERE id = ?", [id]);
      if (res.affectedRows === 0) throw { kind: "not_found" };
      return res;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Category;