const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// ---------- Config ----------
const PORT = process.env.PORT || 8080;
const corsOptions = {
  origin: "http://localhost:8081"
};

// ---------- Middleware ----------
app.use("/api", cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------- View Engine ----------
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "app/views"));

// ---------- Routes ----------
app.get("/", (req, res) => {
  res.redirect("/tutorials");
});

app.use("/", require("./app/routes/tutorial.view.routes"));
app.use("/api/tutorials", require("./app/routes/tutorial.routes"));

// ---------- Start Server ----------
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
