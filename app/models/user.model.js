const sql = require("./db.js");
const bcrypt = require("bcrypt");

class User {
  constructor(user) {
    this.username = user.username;
    this.email = user.email;
    this.password = user.password;
  }

  // Create a new user (Register)
  static async create(newUser) {
    try {
      // Hash the password before saving
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newUser.password, saltRounds);
      
      const userToInsert = {
        username: newUser.username,
        email: newUser.email,
        password: hashedPassword
      };

      const [res] = await sql.query("INSERT INTO users SET ?", userToInsert);
      return { id: res.insertId, username: newUser.username, email: newUser.email };
    } catch (err) {
      // Check for duplicate entry errors
      if (err.code === 'ER_DUP_ENTRY') {
        if (err.message.includes('username')) {
          throw { kind: "duplicate", field: "username" };
        }
        if (err.message.includes('email')) {
          throw { kind: "duplicate", field: "email" };
        }
      }
      console.error("Error creating user:", err);
      throw err;
    }
  }

  // Find user by email (for login)
  static async findByEmail(email) {
    try {
      const [rows] = await sql.query("SELECT * FROM users WHERE email = ?", [email]);
      if (rows.length) return rows[0];
      return null;
    } catch (err) {
      throw err;
    }
  }

  // Find user by username
  static async findByUsername(username) {
    try {
      const [rows] = await sql.query("SELECT * FROM users WHERE username = ?", [username]);
      if (rows.length) return rows[0];
      return null;
    } catch (err) {
      throw err;
    }
  }

  // Find user by ID
  static async findById(id) {
    try {
      const [rows] = await sql.query("SELECT id, username, email, created_at FROM users WHERE id = ?", [id]);
      if (rows.length) return rows[0];
      return null;
    } catch (err) {
      throw err;
    }
  }

  // Verify password (for login)
  static async verifyPassword(plainPassword, hashedPassword) {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (err) {
      throw err;
    }
  }

  // Get all users (for admin purposes - optional)
  static async getAll() {
    try {
      const [rows] = await sql.query("SELECT id, username, email, created_at FROM users");
      return rows;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = User;