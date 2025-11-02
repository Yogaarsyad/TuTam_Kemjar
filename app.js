// app.js (Versi FINAL & AMAN)

require("dotenv").config();
const cors = require("cors");
const express = require("express");
const helmet = require("helmet"); // Perbaikan Poin #11 (CSP)
const { testConnection } = require("./db"); // Import testConnection

const userRoutes = require("./routes/userRoutes");
const flagRoutes = require("./routes/flagRoutes");

const app = express();
const port = process.env.PORT || 3000;

// Perbaikan Poin #8: Wajib agar rate-limiter bisa melihat IP Anda
app.set('trust proxy', 1);

// Middleware Keamanan
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet()); // Perbaikan Poin #11: Menerapkan header keamanan

// Routes
app.use("/users", userRoutes);
app.use("/flags", flagRoutes);

// Endpoint dasar
app.get("/", (req, res) => {
    res.json({ message: "Welcome to Kemjar 7 API. Stay secure!" });
});

// Mulai server
app.listen(port, async () => {
  console.log(`✅ Server running at http://localhost:${port}`);
  try {
    await testConnection(); 
    console.log("✅ Connected to database!");
  } catch (err) {
    console.error("Database connection failed:", err.message);
  }
});