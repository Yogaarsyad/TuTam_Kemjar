const sql = require("../db");
const { pool } = require('../db');

// Menggunakan Parameterized Query untuk semua operasi database di model ini.
exports.findAll = async () => {
   return await sql`SELECT id, name, username, email FROM users`;
};

exports.findById = async (id) => {
 const result = await sql`SELECT id, name, username, email FROM users WHERE id = ${id}`;
 return result[0];
};

exports.create = async ({ name, username, email, password }) => {
 
  // Pastikan password sudah di-hash SEBELUM dipanggil controller.
 const result = await sql`
 INSERT INTO users (name, username, email, password)
 VALUES (${name}, ${username}, ${email}, ${password})
 RETURNING id, name, username, email;
 `;
 return result[0];
};

exports.update = async (id, { name, username, email, password }) => {

  // Pastikan password sudah di-hash SEBELUM dipanggil controller.
 const result = await sql`
 UPDATE users
 SET name = ${name}, username = ${username}, email = ${email}, password = ${password}
 WHERE id = ${id}
 RETURNING id, name, username, email;
 `;
 return result[0];
};

exports.remove = async (id) => {
  // Parameterized Query untuk menghapus user
 await sql`DELETE FROM users WHERE id = ${id}`;
};

exports.findByCredentials = async (username, password) => {
// RENTAN terhadap Blind SQL Injection
 const result = await sql`
 SELECT id, name, username, email FROM users
 WHERE username = ${username} AND password = ${password}
 `;
 return result[0];
};


 // Parameterized Query untuk Login
exports.findByUsername = async (username) => {
    const result = await sql`
      SELECT * FROM users 
      WHERE username = ${username}
    `;
    return result[0];
};

exports.findVulnerable = async (username, password) => {
  console.warn("Panggilan ke fungsi 'findVulnerable' yang tidak aman telah diblokir.");
  return null;
};

exports.findPasswordByCredentials = async (username, password) => {

  console.warn("Panggilan ke fungsi 'findPasswordByCredentials' yang tidak aman telah diblokir.");
  return null;

};