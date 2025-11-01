const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const rateLimit = require('express-rate-limit'); 

// Saya membuat limiter untuk endpoint yang sensitif (login, register, password):
const authLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, 
	max: 10, 
	message: 'Terlalu banyak percobaan dari IP ini, coba lagi setelah 15 menit',
    standardHeaders: true, 
    legacyHeaders: false, 
});

// Endpoint standar (CRUD):
router.get("/", userController.getUsers);
router.put("/:id", userController.updateUser); 
router.delete("/:id", userController.deleteUser); 


// Menerapkan limiter ke register:
router.post("/", authLimiter, userController.createUser); 
router.post("/login", authLimiter, userController.loginSecure);
// Menerapkan limiter ke password retrieval:
router.post("/password", authLimiter, userController.getPasswordByCredentials);

module.exports = router;