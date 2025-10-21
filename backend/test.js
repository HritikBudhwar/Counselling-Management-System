import db from './config/db.js'
db.query("SHOW TABLES;", (err, results) => {
  if (err) throw err;
  console.log("Tables in CounselingDB:", results);
  db.end();
});
