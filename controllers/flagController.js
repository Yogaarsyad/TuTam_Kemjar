const Flag = require("../models/flagModels");

exports.validateFlags = async (req, res) => {
 const { user_id, flag } = req.body;

    // 5. Validasi input sisi server
    if (!user_id || !flag) {
        return res.status(400).json({ error: "user_id dan flag wajib diisi." });
    }
    // Memastikan flag = string dan tidak terlalu panjang.
    if (typeof flag !== 'string' || flag.length > 100) { 
        return res.status(400).json({ error: "Format flag tidak valid." });
    }
    // Asumsi user_id adalah angka.
    if (isNaN(parseInt(user_id))) {
        return res.status(400).json({ error: "user_id tidak valid." });
    }

 try{

// Panggil model untuk validasi flag.
 const result = await Flag.validateFlags(user_id, flag);
 return res.json(result);
 } catch (error) {

    // 6. Log error di server dan dikirim pesan generik ke user:
 console.error("Error validating flags:", error);
 return res.status(500).json({ error: "Internal server error" });
}
}