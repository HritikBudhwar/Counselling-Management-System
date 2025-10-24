import db from '../config/db.js';

export const getAllCollege = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM College");
    res.json(rows);
  } catch (err) {
    console.error("Error in fetching colleges", err);
    res.status(500).json({ Error: "Database error" });
  }
};

export const getCollegeById = async (req, res) => {
  try {
    const [request] = await db.query("SELECT * FROM College WHERE college_id = ?", [req.params.id]);
    if (request.length === 0) return res.status(404).json({ message: "College not found" });
    res.json(request[0]);
  } catch (err) {
    console.error("Database Error", err);
    res.status(500).json({ Error: "Database Error" });
  }
};

export const AddCollege = async (req, res) => {
  const { name, location, college_type, affiliation } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO College (name, location, college_type, affiliation) VALUES (?, ?, ?, ?)",
      [name, location, college_type, affiliation]
    );
    res.status(201).json({ message: "College created", id: result.insertId });
  } catch (err) {
    console.error("Error creating College", err);
    res.status(500).json({ Error: "Database error" });
  }
};

export const updateCollege = async (req, res) => {
  const { name, location, college_type, affiliation } = req.body;
  try {
    const [results] = await db.query(
      "UPDATE College SET name = ?, location = ?, college_type = ?, affiliation = ? WHERE college_id = ?",
      [name, location, college_type, affiliation, req.params.id]
    );
    if (results.affectedRows === 0) return res.status(404).json({ message: "College not found" });
    res.json({ message: "College updated" });
  } catch (err) {
    console.error("Error updating college:", err);
    res.status(500).json({ Error: "Database error" });
  }
};

export const deleteCollege = async (req, res) => {
  try {
    const [results] = await db.query("DELETE FROM College WHERE college_id = ?", [req.params.id]);
    if (results.affectedRows === 0) return res.status(404).json({ message: "College not found" });
    res.json({ message: "College deleted" });
  } catch (err) {
    console.error("Error deleting the College", err);
    res.status(500).json({ Error: "Database error" });
  }
};
