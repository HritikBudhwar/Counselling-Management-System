// import db from '../config/db.js';

// // GET all counseling rounds
// // export const getAllCounselingRounds = async (req, res) => {
// //   try {
// //     // Assuming you have an 'Exam' table to join and display the exam name
// //     const [rows] = await db.query(`
// //       SELECT 
// //         C.*, E.name AS exam_name
// //       FROM Counseling C
// //       LEFT JOIN Exam E ON C.exam_id = E.exam_id
// //       ORDER BY C.exam_id, C.round_no
// //     `);
// //     res.json(rows);
// //   } catch (err) {
// //     console.error("Error fetching counseling rounds:", err);
// //     res.status(500).json({ Error: "Database error fetching counseling rounds" });
// //   }
// // };

// // backend/controllers/counselingController.js

// // GET all counseling rounds
// export const getAllCounselingRounds = async (req, res) => {
//   try {
//     // 🚨 FIX: Change E.name to E.exam_name to match your database schema
//     const [rows] = await db.query(`
//       SELECT 
//         C.*, E.exam_name AS exam_name 
//       FROM Counseling C
//       LEFT JOIN Exam E ON C.exam_id = E.exam_id
//       ORDER BY C.exam_id, C.round_no
//     `);
//     res.json(rows);
//   } catch (err) {
//     console.error("Error fetching counseling rounds:", err);
//     // If this query fails, it will send a 500 error, and the frontend rounds list will be empty.
//     res.status(500).json({ Error: "Database error fetching counseling rounds" });
//   }
// };

// // POST a new counseling round (Admin Action)
// export const addCounselingRound = async (req, res) => {
//   const { exam_id, round_no, counseling_date, status } = req.body;

//   if (!exam_id || !round_no || !status) {
//     return res.status(400).json({ message: "Exam ID, Round No, and Status are required." });
//   }

//   try {
//     const [result] = await db.query(
//       "INSERT INTO Counseling (exam_id, round_no, counseling_date, status) VALUES (?, ?, ?, ?)",
//       [exam_id, round_no, counseling_date || null, status] // Allow date to be null initially
//     );
//     res.status(201).json({ 
//       message: "Counseling round added successfully", 
//       counseling_id: result.insertId 
//     });
//   } catch (err) {
//     console.error("Error adding counseling round:", err);
//     res.status(500).json({ Error: "Database error adding counseling round" });
//   }
// };

// // PUT/PATCH update the status or date of a counseling round (Admin Action)
// export const updateCounselingRound = async (req, res) => {
//   const { counseling_date, status } = req.body;
//   const { id } = req.params;

//   if (!status) {
//     return res.status(400).json({ message: "Status is required for update." });
//   }
  
//   try {
//     const [results] = await db.query(
//       "UPDATE Counseling SET counseling_date = ?, status = ? WHERE counseling_id = ?",
//       [counseling_date || null, status, id]
//     );

//     if (results.affectedRows === 0) {
//       return res.status(404).json({ message: "Counseling round not found" });
//     }
    
//     res.json({ message: "Counseling round updated successfully" });
//   } catch (err) {
//     console.error("Error updating counseling round:", err);
//     res.status(500).json({ Error: "Database error updating counseling round" });
//   }
// };

// // DELETE a counseling round (Optional, but useful for admin control)
// export const deleteCounselingRound = async (req, res) => {
//   try {
//     const [results] = await db.query("DELETE FROM Counseling WHERE counseling_id = ?", [req.params.id]);
    
//     if (results.affectedRows === 0) {
//       return res.status(404).json({ message: "Counseling round not found" });
//     }
    
//     res.json({ message: "Counseling round deleted successfully" });
//   } catch (err) {
//     console.error("Error deleting counseling round:", err);
//     res.status(500).json({ Error: "Database error deleting counseling round" });
//   }
// };












import db from '../config/db.js';

// GET all counseling rounds
export const getAllCounselingRounds = async (req, res) => {
  try {
    // FIX APPLIED: Using E.exam_name instead of E.name
    const [rows] = await db.query(`
      SELECT 
    C.counseling_id,
    C.round_no,
    C.status,
    C.counseling_date,
    E.exam_name,
    
    -- Aggregates data to show the "health" of the counseling round
    COUNT(SA.allocation_id) AS total_seats_allocated,
    SUM(S.total_seats) AS total_capacity_for_exam
    
FROM 
    Counseling C
    
-- Join with Exam (as you did)
JOIN 
    Exam E ON C.exam_id = E.exam_id
    
-- Join Course, Seats, and Allocation to aggregate data
LEFT JOIN 
    Course CR ON E.exam_id = CR.exam_id  -- Assumes Course is linked to Exam
LEFT JOIN 
    Seats S ON CR.course_id = S.course_id
LEFT JOIN 
    Seat_Allocation SA ON CR.course_id = SA.course_id AND SA.counseling_id = C.counseling_id
    
GROUP BY
    C.counseling_id, E.exam_name, C.round_no, C.status, C.counseling_date
    
ORDER BY 
    C.exam_id, C.round_no;
    `);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching counseling rounds:", err);
    res.status(500).json({ Error: "Database error fetching counseling rounds" });
  }
};

// POST a new counseling round (Admin Action)
export const addCounselingRound = async (req, res) => {
  const { exam_id, round_no, counseling_date, status } = req.body;

  if (!exam_id || !round_no || !status) {
    return res.status(400).json({ message: "Exam ID, Round No, and Status are required." });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO Counseling (exam_id, round_no, counseling_date, status) VALUES (?, ?, ?, ?)",
      [exam_id, round_no, counseling_date || null, status]
    );
    res.status(201).json({ 
      message: "Counseling round added successfully", 
      counseling_id: result.insertId 
    });
  } catch (err) {
    console.error("Error adding counseling round:", err);
    res.status(500).json({ Error: "Database error adding counseling round" });
  }
};

// PUT/PATCH update the status or date of a counseling round (Admin Action)
export const updateCounselingRound = async (req, res) => {
  const { counseling_date, status } = req.body;
  const { id } = req.params;

  if (!status) {
    return res.status(400).json({ message: "Status is required for update" });
  }
  
  try {
    const [results] = await db.query(
      "UPDATE Counseling SET counseling_date = ?, status = ? WHERE counseling_id = ?",
      [counseling_date || null, status, id]
    );

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Counseling round not found" });
    }
    
    res.json({ message: "Counseling round updated successfully" });
  } catch (err) {
    console.error("Error updating counseling round:", err);
    res.status(500).json({ Error: "Database error updating counseling round" });
  }
};

// DELETE a counseling round (Optional, but useful for admin control)
export const deleteCounselingRound = async (req, res) => {
  try {
    const [results] = await db.query("DELETE FROM Counseling WHERE counseling_id = ?", [req.params.id]);
    
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Counseling round not found" });
    }
    
    res.json({ message: "Counseling round deleted successfully" });
  } catch (err) {
    console.error("Error deleting counseling round:", err);
    res.status(500).json({ Error: "Database error deleting counseling round" });
  }
};