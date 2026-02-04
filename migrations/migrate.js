const createTutorialsTable = require("./create_tutorials_table");
const createUsersTable = require("./create_users_table");
const createSessionsTable = require("./create_sessions_table");
const addImageToTutorials = require("./add_image_to_tutorials");
const createCategoriesTable = require("./create_categories_table");
const createTagsTable = require("./create_tags_table");
const createTutorialTagsTable = require("./create_tutorial_tags_table");
const addCategoryToTutorials = require("./add_category_to_tutorials");
const seedCategories = require("./seed_categories");

const runMigrations = async () => {
  console.log("🚀 Running migrations...\n");
  
  try {
    // Create base tables first
    await createTutorialsTable();
    await createUsersTable();
    await createSessionsTable();
    
    // Add image column
    await addImageToTutorials();
    
    // Create categories and tags tables
    await createCategoriesTable();
    await createTagsTable();
    
    // Add category foreign key to tutorials
    await addCategoryToTutorials();
    
    // Create junction table (requires tutorials and tags to exist)
    await createTutorialTagsTable();
    
    // Seed initial categories
    await seedCategories();
    
    console.log("\n✅ All migrations completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("\n❌ Migration failed:", err);
    process.exit(1);
  }
};

// Run migrations
runMigrations();