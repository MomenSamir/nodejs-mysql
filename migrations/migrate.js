const createTutorialsTable = require("./create_tutorials_table");
const createUsersTable = require("./create_users_table");
const createSessionsTable = require("./create_sessions_table");
const addImageToTutorials = require("./add_image_to_tutorials");

const runMigrations = async () => {
  console.log("🚀 Running migrations...\n");
  
  try {
    // Run migrations in order
    await createTutorialsTable();
    await createUsersTable();
    await createSessionsTable();
    await addImageToTutorials();
    
    console.log("\n✅ All migrations completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("\n❌ Migration failed:", err);
    process.exit(1);
  }
};

// Run migrations
runMigrations();