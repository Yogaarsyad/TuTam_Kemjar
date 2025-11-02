require("dotenv").config();

const { Pool: PgPool } = require('pg');
let NeonPool, neon;
try {
  ({ Pool: NeonPool, neon } = require('@neondatabase/serverless'));
} catch (e) {

  NeonPool = null;
  neon = null;
}

const buildConnectionString = () => {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  const user = encodeURIComponent(process.env.DB_USER || 'postgres');
  const pass = encodeURIComponent(process.env.DB_PASSWORD || '');
  const host = process.env.DB_HOST || 'localhost';
  const port = process.env.DB_PORT || '5432';
  const db = process.env.DB_NAME || 'postgres';
  return `postgresql://${user}:${pass}@${host}:${port}/${db}`;
};

const connectionString = buildConnectionString();

let pool;
let sql = null;

if (process.env.NODE_ENV === 'production' && NeonPool && neon) {
  console.log("Running in production, using Neon serverless driver.");
  pool = new NeonPool({ connectionString });
  sql = neon(connectionString);
} else {
  console.log("✅ Running locally, using standard `pg` driver.");
  pool = new PgPool({ connectionString });

    const postgres = require('postgres');
    sql = postgres(connectionString);
  } catch (e) {
    console.warn("Library 'postgres' tidak terinstal. Fitur model yang menggunakan `sql`...`` mungkin gagal.");
    sql = null;
  }
}

async function testConnection() {
  if (!pool) throw new Error("Database pool is not initialized");
  const client = await pool.connect();
  try {

    await client.query('SELECT 1');

  } finally {
    client.release();
  }
}

module.exports = { pool, sql, testConnection };

