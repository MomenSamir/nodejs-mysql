const mysql = require("mysql2");
const dbConfig = require("../config/db.config.js");

const pool = mysql.createPool({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB
});

module.exports = pool.promise(); // <-- promise-based pool
