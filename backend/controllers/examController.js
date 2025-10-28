// // backend/controllers/examController.js
// import db from '../config/db.js';

// // GET all exams
// export const getAllExams = async (req, res) => {
//   try {
//     // Fetch only the ID and Name, as required by the frontend dropdown
//     const [rows] = await db.query("SELECT exam_id, exam_name as name FROM Exam");
//     res.json(rows);
//   } catch (err) {
//     console.error("Error fetching exams:", err);
//     res.status(500).json({ Error: "Database error fetching exams" });
//   }
// };

// // Add other methods like addExam, deleteExam if needed later


// backend/controllers/examController.js (VERIFIED FIX)
import db from '../config/db.js';

export const getAllExams = async (req, res) => {
  try {
    // 🚨 FIX: Alias exam_name to 'name' to match frontend expectation
    const [rows] = await db.query("SELECT exam_id, exam_name AS name FROM Exam");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching exams:", err);
    res.status(500).json({ Error: "Database error fetching exams" });
  }
};