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

// ---------- Middleware (Apply to ALL routes) ----------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

// ---------- Static Files (Serve uploaded images) ----------
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// ---------- Session Middleware (Apply to ALL routes) ----------
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

// Attach user to all views (non-blocking)
const { attachUser } = require("./app/middleware/auth.middleware");
app.use(attachUser);

// ---------- View Engine ----------
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "app/views"));

// ---------- Routes (ORDER MATTERS!) ----------

// 1. Root redirect
app.get("/", (req, res) => {
  res.redirect("/tutorials");
});

// 2. Auth routes FIRST (most specific)
// Auth routes (API) - PUBLIC (register/login) and PROTECTED (logout/me)
app.use("/api/auth", require("./app/routes/auth.routes"));

// Auth routes (view) - PUBLIC
app.use("/", require("./app/routes/auth.view.routes"));

// 3. Category & Tag routes (API) - PROTECTED
app.use("/api/categories", require("./app/routes/category.routes"));
app.use("/api/tags", require("./app/routes/tag.routes"));

// 4. Tutorial routes (API) - PROTECTED (inside the route file)
app.use("/api/tutorials", require("./app/routes/tutorial.routes"));

// 5. Tutorial routes (view) - PROTECTED (inside the route file)
app.use("/", require("./app/routes/tutorial.view.routes"));

// ---------- Start Server ----------
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});