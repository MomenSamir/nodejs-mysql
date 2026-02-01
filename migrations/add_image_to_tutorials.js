const sql = require("../app/models/db.js");

const addImageToTutorials = async () => {
  try {
    // Check if column exists first
    const [columns] = await sql.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'tutorials' 
      AND COLUMN_NAME = 'image'
    `);

    if (columns.length > 0) {
      console.log("✓ Image column already exists in tutorials table");
      return;
    }

    // Add the column if it doesn't exist
    await sql.query(`
      ALTER TABLE tutorials 
      ADD COLUMN image VARCHAR(255) DEFAULT NULL
    `);
    
    console.log("✓ Image column added to tutorials table");
  } catch (err) {
    console.error("✗ Error adding image column:", err);
    throw err;
  }
};

module.exports = addImageToTutorials;