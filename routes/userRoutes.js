// routes/userRoutes.js

const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const rateLimit = require('express-rate-limit'); 

// Perbaikan Poin #8: Membuat limiter
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 5, // Diubah ke 5 sesuai permintaan Anda
    message: 'Terlalu banyak percobaan dari IP ini, coba lagi setelah 15 menit',
    standardHeaders: true, 
    legacyHeaders: false, 
});

// Endpoint standar (CRUD)
router.get("/", userController.getUsers);
router.put("/:id", userController.updateUser); 
router.delete("/:id", userController.deleteUser); 

// Perbaikan Poin #8: Menerapkan limiter ke endpoint sensitif
router.post("/", authLimiter, userController.createUser); 
router.post("/login", authLimiter, userController.loginSecure);
router.post("/password", authLimiter, userController.getPasswordByCredentials);

module.exports = router;