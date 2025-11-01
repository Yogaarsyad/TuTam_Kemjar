const express = require("express");
const router = express.Router();
const flagController = require("../controllers/flagController");
const rateLimit = require('express-rate-limit'); // Import rate-limit.

// saya membuatlimiter untuk endpoint validasi:
const flagLimiter = rateLimit({
	windowMs: 5 * 60 * 1000, 
	max: 30, 
	message: 'Terlalu banyak percobaan validasi flag, coba lagi nanti yak!.',
    standardHeaders: true,
    legacyHeaders: false,
});

// menerapkan limiter ke endpoint:
router.post("/validate", flagLimiter, flagController.validateFlags);

module.exports = router;