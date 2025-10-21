import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config(); // loads variables from .env

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10
});

db.connect(err => {
  if (err) throw err;
  console.log("✅ MySQL Connected...");
});

export default db;
