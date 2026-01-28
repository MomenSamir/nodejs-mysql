const sql = require("../app/models/db.js");

const createTutorialsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS tutorials (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      published BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `;

  try {
    await sql.query(query); // <-- no callback
    console.log("Tutorials table created or already exists");
  } catch (err) {
    console.error("Error creating tutorials table:", err);
  }
};

module.exports = createTutorialsTable;