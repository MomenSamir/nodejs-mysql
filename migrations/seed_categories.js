const sql = require("../app/models/db.js");

const seedCategories = async () => {
  const categories = [
    { name: 'Frontend Development', slug: 'frontend', description: 'HTML, CSS, JavaScript, React, Vue' },
    { name: 'Backend Development', slug: 'backend', description: 'Node.js, PHP, Python, APIs' },
    { name: 'Database', slug: 'database', description: 'MySQL, MongoDB, PostgreSQL' },
    { name: 'DevOps', slug: 'devops', description: 'Docker, CI/CD, Cloud' },
    { name: 'Mobile Development', slug: 'mobile', description: 'React Native, Flutter, iOS, Android' },
    { name: 'Other', slug: 'other', description: 'Miscellaneous tutorials' }
  ];

  try {
    // Check if categories already exist
    const [existing] = await sql.query('SELECT COUNT(*) as count FROM categories');
    
    if (existing[0].count > 0) {
      console.log("✓ Categories already seeded");
      return;
    }

    // Insert categories
    for (const category of categories) {
      await sql.query(
        'INSERT INTO categories (name, slug, description) VALUES (?, ?, ?)',
        [category.name, category.slug, category.description]
      );
    }
    
    console.log(`✓ Seeded ${categories.length} categories`);
  } catch (err) {
    console.error("✗ Error seeding categories:", err);
    throw err;
  }
};

module.exports = seedCategories;