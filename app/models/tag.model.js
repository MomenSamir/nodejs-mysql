const sql = require("./db.js");

class Tag {
  constructor(tag) {
    this.name = tag.name;
    this.slug = tag.slug;
  }

  // Create a new Tag
  static async create(newTag) {
    try {
      const [res] = await sql.query("INSERT INTO tags SET ?", newTag);
      return { id: res.insertId, ...newTag };
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        throw { kind: "duplicate", field: "name or slug" };
      }
      console.error("Error creating tag:", err);
      throw err;
    }
  }

  // Find by Id
  static async findById(id) {
    try {
      const [rows] = await sql.query("SELECT * FROM tags WHERE id = ?", [id]);
      if (rows.length) return rows[0];
      throw { kind: "not_found" };
    } catch (err) {
      throw err;
    }
  }

  // Find by name or create if doesn't exist
  static async findOrCreate(name) {
    try {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      
      // Check if tag exists
      const [existing] = await sql.query("SELECT * FROM tags WHERE slug = ?", [slug]);
      
      if (existing.length > 0) {
        return existing[0];
      }
      
      // Create new tag
      const [res] = await sql.query("INSERT INTO tags (name, slug) VALUES (?, ?)", [name, slug]);
      return { id: res.insertId, name, slug };
    } catch (err) {
      throw err;
    }
  }

  // Get all tags
  static async getAll() {
    try {
      const [rows] = await sql.query("SELECT * FROM tags ORDER BY name ASC");
      return rows;
    } catch (err) {
      throw err;
    }
  }

  // Get tags with tutorial count
  static async getAllWithCount() {
    try {
      const query = `
        SELECT t.*, COUNT(tt.tutorial_id) as tutorial_count
        FROM tags t
        LEFT JOIN tutorial_tags tt ON t.id = tt.tag_id
        GROUP BY t.id
        ORDER BY tutorial_count DESC, t.name ASC
      `;
      const [rows] = await sql.query(query);
      return rows;
    } catch (err) {
      throw err;
    }
  }

  // Get tags for a specific tutorial
  static async getByTutorialId(tutorialId) {
    try {
      const query = `
        SELECT t.*
        FROM tags t
        INNER JOIN tutorial_tags tt ON t.id = tt.tag_id
        WHERE tt.tutorial_id = ?
        ORDER BY t.name ASC
      `;
      const [rows] = await sql.query(query, [tutorialId]);
      return rows;
    } catch (err) {
      throw err;
    }
  }

  // Attach tag to tutorial (many-to-many)
  static async attachToTutorial(tutorialId, tagId) {
    try {
      await sql.query(
        "INSERT IGNORE INTO tutorial_tags (tutorial_id, tag_id) VALUES (?, ?)",
        [tutorialId, tagId]
      );
    } catch (err) {
      throw err;
    }
  }

  // Detach tag from tutorial
  static async detachFromTutorial(tutorialId, tagId) {
    try {
      await sql.query(
        "DELETE FROM tutorial_tags WHERE tutorial_id = ? AND tag_id = ?",
        [tutorialId, tagId]
      );
    } catch (err) {
      throw err;
    }
  }

  // Sync tags for a tutorial (remove old, add new)
  static async syncTutorialTags(tutorialId, tagIds) {
    try {
      // Remove all existing tags for this tutorial
      await sql.query("DELETE FROM tutorial_tags WHERE tutorial_id = ?", [tutorialId]);
      
      // Add new tags
      if (tagIds && tagIds.length > 0) {
        const values = tagIds.map(tagId => [tutorialId, tagId]);
        await sql.query(
          "INSERT INTO tutorial_tags (tutorial_id, tag_id) VALUES ?",
          [values]
        );
      }
    } catch (err) {
      throw err;
    }
  }

  // Update by Id
  static async updateById(id, tag) {
    try {
      const [res] = await sql.query(
        "UPDATE tags SET name = ?, slug = ? WHERE id = ?",
        [tag.name, tag.slug, id]
      );
      if (res.affectedRows === 0) throw { kind: "not_found" };
      return { id, ...tag };
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
      // Tutorial_tags will be automatically deleted due to ON DELETE CASCADE
      const [res] = await sql.query("DELETE FROM tags WHERE id = ?", [id]);
      if (res.affectedRows === 0) throw { kind: "not_found" };
      return res;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Tag;