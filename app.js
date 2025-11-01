require("dotenv").config();
// require('isomorphic-fetch'); // <-- Ini tidak terpakai, bisa dihapus
const cors = require("cors");
const express = require("express");
const helmet = require("helmet"); // UPDATE (PERBAIKAN #11): Tambahkan Helmet
const { pool, testConnection } = require("./db"); // <-- PENTING untuk cek koneksi DB

// Import Rute
const userRoutes = require("./routes/userRoutes");
const flagRoutes = require("./routes/flagRoutes");

const app = express();
const port = process.env.PORT || 3000; // Gunakan port 3000 dari file Anda

// --- Middleware Keamanan ---

// UPDATE (PERBAIKAN #8): Tambahkan ini agar express-rate-limit
// (yang ada di file routes) bisa mendeteksi IP Anda dengan benar.
app.set('trust proxy', 1); 
// AKHIR UPDATE (PERBAIKAN #8)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet()); // UPDATE (PERBAIKAN #11): Terapkan header keamanan

// --- Rute Aplikasi ---
app.use("/users", userRoutes);
app.use("/flags", flagRoutes);

// Endpoint dasar
app.get("/", (req, res) => {
    res.json({ message: "Welcome to Kemjar 7 API. Stay secure!" });
});

// --- Start Server ---
// UPDATE: Menggunakan logika start server yang aman
// dan mengecek koneksi database
app.listen(port, async () => {
    console.log(`✅ Server running at http://localhost:${port}`);
    try {
        await testConnection(); // Uji koneksi database saat startup
        console.log("✅ Connected to database!");
        const version = await pool.query("SELECT version();");
        console.log(`PostgreSQL version: ${version.rows[0].version}`);
    } catch (err) {
        console.error("Database connection failed:", err.message);
    }
});

