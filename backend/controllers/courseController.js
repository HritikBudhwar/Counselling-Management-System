// import db from '../config/db.js';

// // GET all courses
// export const getAllCourses = async (req, res) => {
//   try {
//     // Fetches all rows from the 'Course' table.
//     const [rows] = await db.query("SELECT * FROM Course");
//     res.json(rows);
//   } catch (err) {
//     console.error("Error fetching courses:", err);
//     res.status(500).json({ Error: "Database error fetching courses" });
//   }
// };

// // POST a new course
// export const addCourse = async (req, res) => {
//   // Destructure fields from the request body.
//   const { college_id, course_name, duration_years, fees, eligibility_id } = req.body;

//   // Simple validation to ensure required fields are present.
//   if (!college_id || !course_name) {
//     return res.status(400).json({ message: "College ID and Course Name are required." });
//   }

//   try {
//     // Insert new course data into the Course table.
//     const [result] = await db.query(
//       "INSERT INTO Course (college_id, course_name, duration_years, fees, eligibility_id) VALUES (?, ?, ?, ?, ?)",
//       [college_id, course_name, duration_years, fees, eligibility_id]
//     );
    
//     // Respond with success and the ID of the new course.
//     res.status(201).json({ 
//       message: "Course added successfully", 
//       course_id: result.insertId 
//     });
//   } catch (err) {
//     console.error("Error adding course:", err);
//     res.status(500).json({ Error: "Database error adding course" });
//   }
// };

// // DELETE a course
// export const deleteCourse = async (req, res) => {
//   // The course_id to delete is passed as a route parameter (e.g., /api/courses/5).
//   try {
//     const [results] = await db.query("DELETE FROM Course WHERE course_id = ?", [req.params.id]);
    
//     // Check if any rows were affected (meaning the course was found and deleted).
//     if (results.affectedRows === 0) {
//       return res.status(404).json({ message: "Course not found" });
//     }
    
//     res.json({ message: "Course deleted successfully" });
//   } catch (err) {
//     console.error("Error deleting course:", err);
//     res.status(500).json({ Error: "Database error deleting course" });
//   }
// };

// backend/controllers/courseController.js (Must be in this file)
// Add or verify this function exists and is exported:

// export const getAllCoursesWithDetails = async (req, res) => {
//     try {
//         const [rows] = await db.query(`
//             SELECT 
//                 CR.course_id, 
//                 CR.course_name, 
//                 C.college_id, 
//                 C.name AS college_name,
//                 CR.duration_years,
//                 CR.fees
//             FROM Course CR
//             JOIN College C ON CR.college_id = C.college_id
//             ORDER BY C.name, CR.course_name
//         `);
//         res.json(rows);
//     } catch (err) {
//         console.error("Error fetching detailed course list:", err);
//         res.status(500).json({ Error: "Database error fetching detailed course data" });
//     }
// };





// backend/controllers/courseController.js
import db from '../config/db.js';

// GET all courses
export const getAllCourses = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM Course");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching courses:", err);
    res.status(500).json({ Error: "Database error fetching courses" });
  }
};

export const addCourse = async (req, res) => {
  // 🚨 FIX: Removed eligibility_id from destructuring
  const { college_id, course_name, duration_years, fees } = req.body; 

  if (!college_id || !course_name) {
    return res.status(400).json({ message: "College ID and Course Name are required." });
  }

  try {
    // 🚨 FIX: Removed eligibility_id from the SQL INSERT statement
    const [result] = await db.query(
      "INSERT INTO Course (college_id, course_name, duration_years, fees) VALUES (?, ?, ?, ?)",
      [college_id, course_name, duration_years, fees]
    );
    
    res.status(201).json({ message: "Course added successfully", course_id: result.insertId });
  } catch (err) {
    console.error("Error adding course:", err);
    res.status(500).json({ Error: "Database error adding course" });
  }
};

export const deleteCourse = async (req, res) => {
  const { id } = req.params; // This is the course_id to delete

  try {
    await db.query("START TRANSACTION");
    await db.query("DELETE FROM Course_Eligibility WHERE course_id = ?", [id]);
    await db.query("DELETE FROM Preference WHERE course_id = ?", [id]);
    await db.query("DELETE FROM Seat_Allocation WHERE course_id = ?", [id]);
    await db.query("DELETE FROM Seats WHERE course_id = ?", [id]);
    const [results] = await db.query("DELETE FROM Course WHERE course_id = ?", [id]);
    if (results.affectedRows === 0) {
      await db.query("ROLLBACK");
      return res.status(404).json({ message: "Course not found" });
    }
    await db.query("COMMIT");
    res.json({ message: "Course and all related data deleted successfully" });
  } catch (err) {
    await db.query("ROLLBACK");
    console.error("Error deleting course (Transaction Rolled Back):", err);
    res.status(500).json({ Error: "Database error during course deletion", sqlMessage: err.sqlMessage });
  }
};
// GET /api/courses/details - Required by StudentPreferenceForm
export const getAllCoursesWithDetails = async (req, res) => {
    try {
        const [result] = await db.query("CALL GetAllCoursesWithDetails()");
        const rows = result[0]; 
        res.json(rows);
    } catch (err) {
        console.error("Error fetching detailed course list:", err);
        res.status(500).json({ Error: "Database error fetching detailed course data" });
    }
};