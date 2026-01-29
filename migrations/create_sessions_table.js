const sql = require("../app/models/db.js");

const createSessionsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS sessions (
      session_id VARCHAR(128) PRIMARY KEY,
      expires INT UNSIGNED NOT NULL,
      data MEDIUMTEXT,
      INDEX idx_expires (expires)
    )
  `;

  try {
    await sql.query(query);
    console.log("✓ Sessions table created or already exists");
  } catch (err) {
    console.error("✗ Error creating sessions table:", err);
    throw err;
  }
};

module.exports = createSessionsTable;