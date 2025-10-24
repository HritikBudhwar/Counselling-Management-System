import db from './config/db.js';

async function showTables() {
  try {
    const [results] = await db.query("SHOW TABLES;");
    console.log("Tables in CounselingDB:", results);
  } catch (err) {
    console.error("Error fetching tables:", err);
  }
}

showTables();
