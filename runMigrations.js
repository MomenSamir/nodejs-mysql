const createTutorialsTable = require("./migrations/01_create_tutorials_table");

// Add more migrations here as you create them
const migrations = [createTutorialsTable];

migrations.forEach((migrate) => migrate());
