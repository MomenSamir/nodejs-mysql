const sql = require("../app/models/db.js");

const createTutorialTagsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS tutorial_tags (
      tutorial_id INT NOT NULL,
      tag_id INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (tutorial_id, tag_id),
      FOREIGN KEY (tutorial_id) REFERENCES tutorials(id) ON DELETE CASCADE,
      FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
    )
  `;

  try {
    await sql.query(query);
    console.log("✓ Tutorial_tags junction table created or already exists");
  } catch (err) {
    console.error("✗ Error creating tutorial_tags table:", err);
    throw err;
  }
};

module.exports = createTutorialTagsTable;