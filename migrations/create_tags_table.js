const sql = require("../app/models/db.js");

const createTagsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS tags (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(50) UNIQUE NOT NULL,
      slug VARCHAR(50) UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  try {
    await sql.query(query);
    console.log("✓ Tags table created or already exists");
  } catch (err) {
    console.error("✗ Error creating tags table:", err);
    throw err;
  }
};

module.exports = createTagsTable;