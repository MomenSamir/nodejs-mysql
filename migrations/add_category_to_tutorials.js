
const sql = require("../app/models/db.js");

const addCategoryToTutorials = async () => {
  try {
    // Check if column exists first
    const [columns] = await sql.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'tutorials' 
      AND COLUMN_NAME = 'category_id'
    `);

    if (columns.length > 0) {
      console.log("✓ Category_id column already exists in tutorials table");
      return;
    }

    // Add the column with foreign key
    await sql.query(`
      ALTER TABLE tutorials 
      ADD COLUMN category_id INT DEFAULT NULL,
      ADD FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
    `);
    
    console.log("✓ Category_id column added to tutorials table");
  } catch (err) {
    console.error("✗ Error adding category_id column:", err);
    throw err;
  }
};

module.exports = addCategoryToTutorials;