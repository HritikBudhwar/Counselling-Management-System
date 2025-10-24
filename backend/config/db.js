import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'CounselingDB',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

try {
  db.getConnection().then(conn => {
    console.log("✅ MySQL Connected...");
    conn.release();
  });
} catch (err) {
  console.error("❌ MySQL Connection Error:", err);
}

export default db;
