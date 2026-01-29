const express = require("express");
const cors = require("cors");
const path = require("path");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);

const app = express();

// ---------- Config ----------
const PORT = process.env.PORT || 8080;
const corsOptions = {
  origin: "http://localhost:8081"
};

// ---------- Session Store (MySQL) ----------
const sessionStore = new MySQLStore({
  clearExpired: true,
  checkExpirationInterval: 900000, // 15 minutes
  expiration: 86400000, // 1 day
}, require("./app/models/db.js"));

// ---------- Session Middleware ----------
app.use(session({
  key: 'session_cookie_name',
  secret: 'your-secret-key-change-this-in-production', // Change this!
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

// ---------- Middleware ----------
app.use("/api", cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Attach user to all views
const { attachUser } = require("./app/middleware/auth.middleware");
app.use(attachUser);

// ---------- View Engine ----------
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "app/views"));

// ---------- Routes ----------
app.get("/", (req, res) => {
  res.redirect("/tutorials");
});

// Auth routes (view)
app.use("/", require("./app/routes/auth.view.routes"));

// Tutorial routes (view)
app.use("/", require("./app/routes/tutorial.view.routes"));

// Auth routes (API)
app.use("/api/auth", require("./app/routes/auth.routes"));

// Tutorial routes (API)
app.use("/api/tutorials", require("./app/routes/tutorial.routes"));

// ---------- Start Server ----------
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});