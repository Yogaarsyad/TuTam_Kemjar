const User = require("../models/userModels");
const bcrypt = require('bcrypt'); // Import bcrypt untuk hashing.
const saltRounds = 10; 

exports.getUsers = async (req, res) => {
 try {
 const users = await User.findAll();
 res.json(users);
 } catch (err) {

    // Log error di server, dikirim pesan generik ke user:
 console.error(err); 
 res.status(500).json({ error: "Failed to fetch users" });
}
};

exports.createUser = async (req, res) => {
  const { name, username, email, password } = req.body;


  // Validasi input sisi server:
  if (!name || !username || !email || !password) {
    return res.status(400).json({ error: "Semua field wajib diisi yak" });
  }
  if (username.length < 4 || password.length < 8) {
    return res.status(400).json({ error: "Username minimal 4 karakter, password minimal 8 karakter" });
  }
  // Validasi email sederhana:
  if (!email.includes('@')) {
    return res.status(400).json({ error: "Format email tidak valid" });
  }
 try {

    // Hash password SEBELUM disimpan ke database:
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Simpan user baru ke database:
    const newUser = await User.create({ name, username, email, password: hashedPassword });

    
    res.status(201).json(newUser);
    } catch (err) {


    // Log error di server, dikirim pesan generik ke user:
    console.error(err);
  
    if (err.code === '23505') { // Kode error PostgreSQL untuk unique violation.
        return res.status(409).json({ error: "Username atau email sudah ada." });
    }
 res.status(500).json({ error: "Gagal membuat user" });
 }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
 const { name, username, email, password } = req.body;

  // Validasi input sisi server:
  if (!name && !username && !email && !password) {
    return res.status(400).json({ error: "Minimal satu field dibutuhkan untuk update" });
  }

  try {
    const updateData = { name, username, email };

    // Nantinya Hanya hash password jika password baru diberikan:
    if (password) {
        if (password.length < 8) { // Validasi password.
            return res.status(400).json({ error: "Password minimal 8 karakter" });
        }
        updateData.password = await bcrypt.hash(password, saltRounds);
    }

const updatedUser = await User.update(id, updateData);
 if (!updatedUser) return res.status(404).json({ error: "User not found" });
 res.json(updatedUser);
 } catch (err) {

    // Log error di server, dikirim pesan generik ke user:
 console.error(err);
res.status(500).json({ error: "Gagal update user" });
 }
};

exports.deleteUser = async (req, res) => {
const { id } = req.params;
 try {
 await User.remove(id);
 res.json({ message: "User deleted" });
 } catch (err) {
    // Log error di server, dikirim pesan generik ke user juga.
 console.error(err);
 res.status(500).json({ error: "Gagal menghapus user" });
 }
};


exports.loginSecure = async (req, res) => {
    const { username, password } = req.body;

    // Validasi input.
    if (!username || !password) {
        return res.status(400).json({ error: "Username dan password wajib diisi" });
    }

    try {
        // Cari user berdasarkan username:    
        const user = await User.findByUsername(username);

        // Jika user tidak ditemukan:
        if (!user) {
            return res.status(401).json({ error: "Username atau password salah" });
        }

        // Akan membandingkan password yang diberikan dengan yang di database:
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            res.json({ 
                message: "Login successful", 
                user: { id: user.id, username: user.username, name: user.name } 
            });
        } else {
            return res.status(401).json({ error: "Username atau password salah" });
        }
    } catch (err) {
        // Log error di server dan kirim pesan generik ke user:
        console.error(err);
        res.status(500).json({ error: "Login gagal, terjadi kesalahan server" });
    }
};


exports.loginVulnerable = async (req, res) => {
  // ini rentan terhadap SQL Injection!
 const { username, password } = req.body;
 
 try {
 const user = await User.findVulnerable(username, password);
 if (!user) return res.status(401).json({ error: "Invalid credentials" });
 res.json({ message: "Login successful", user });
 } catch (err) {
 console.error(err);
 res.status(500).json({ error: "Login failed" });
 }
};

exports.getPasswordByCredentials = async (req, res) => {
  // ini rentan terhadap SQL Injection!
const { username, password } = req.body;
 try {
 const result = await User.findPasswordByCredentials(username, password);
 if (!result) return res.status(404).json({ error: "User not found" });
 res.json({ response: result });
 } catch (err) {
 console.error(err);
 res.status(500).json({ error: "Failed to fetch password" });
 }
};