import db from '../config/db.js';

// GET all courses
export const getAllCourses = async (req, res) => {
  try {
    // Fetches all rows from the 'Course' table.
    const [rows] = await db.query("SELECT * FROM Course");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching courses:", err);
    res.status(500).json({ Error: "Database error fetching courses" });
  }
};

// POST a new course
export const addCourse = async (req, res) => {
  // Destructure fields from the request body.
  const { college_id, course_name, duration_years, fees, eligibility_id } = req.body;

  // Simple validation to ensure required fields are present.
  if (!college_id || !course_name) {
    return res.status(400).json({ message: "College ID and Course Name are required." });
  }

  try {
    // Insert new course data into the Course table.
    const [result] = await db.query(
      "INSERT INTO Course (college_id, course_name, duration_years, fees, eligibility_id) VALUES (?, ?, ?, ?, ?)",
      [college_id, course_name, duration_years, fees, eligibility_id]
    );
    
    // Respond with success and the ID of the new course.
    res.status(201).json({ 
      message: "Course added successfully", 
      course_id: result.insertId 
    });
  } catch (err) {
    console.error("Error adding course:", err);
    res.status(500).json({ Error: "Database error adding course" });
  }
};

// DELETE a course
export const deleteCourse = async (req, res) => {
  // The course_id to delete is passed as a route parameter (e.g., /api/courses/5).
  try {
    const [results] = await db.query("DELETE FROM Course WHERE course_id = ?", [req.params.id]);
    
    // Check if any rows were affected (meaning the course was found and deleted).
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Course not found" });
    }
    
    res.json({ message: "Course deleted successfully" });
  } catch (err) {
    console.error("Error deleting course:", err);
    res.status(500).json({ Error: "Database error deleting course" });
  }
};