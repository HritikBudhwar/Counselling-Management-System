// src/components/admin/CoursePage.jsx (FINAL FIX)
import React, { useState, useEffect } from "react";
import axios from "axios";
import './CoursePage.css'

const CoursePage = () => {
  const [colleges, setColleges] = useState([]); 
  const [courses, setCourses] = useState([]);
  
  // 🚨 FIX 1: REMOVE eligibility_id from state initialization
  const [newCourse, setNewCourse] = useState({ 
    college_id: "", 
    course_name: "", 
    duration_years: "", 
    fees: "" 
  });
  const token = localStorage.getItem("token");
 
  const fetchColleges = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/colleges");
      setColleges(res.data);
    } catch (err) {
      console.error("Error fetching colleges:", err);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/courses");
      setCourses(res.data);
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  useEffect(() => {
    fetchColleges();
    fetchCourses();
  }, []);

  const handleAddCourse = async () => {
    if (!newCourse.college_id || !newCourse.course_name) {
      alert("Select college and enter course name.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/courses/add", 
        newCourse, // newCourse now only contains the four valid fields
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // 🚨 FIX 2: Reset state without eligibility_id
      setNewCourse({ college_id: "", course_name: "", duration_years: "", fees: "" }); 
      alert("Course added successfully!");
      fetchCourses();
      
      // NOTE: You still need a separate step to link Eligibility and Seats!
      // This step will be done separately via the eligibility routes we designed.

    } catch (err) {
      console.error("Error adding course:", err);
      alert(err.response?.data?.message || "Failed to add course. Check backend logs.");
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCourses();
    } catch (err) {
      console.error("Error deleting course:", err);
    }
  };

  return (
    <div className="course-management">
      <h2>📚 Course Management</h2>

      {/* ADD COURSE SECTION */}
      <section className="add-section">
        <h3>Add New Course</h3>
        <div className="form-group">
          <select
            value={newCourse.college_id}
            onChange={(e) => setNewCourse({ ...newCourse, college_id: e.target.value })}
          >
            <option value="">Select College</option>
            {colleges.map((college) => (
              <option key={college.college_id} value={college.college_id}>
                {college.name}
              </option>
            ))}
          </select>
          
          <input type="text" placeholder="Course Name" value={newCourse.course_name} onChange={(e) => setNewCourse({ ...newCourse, course_name: e.target.value })} />
          <input type="number" placeholder="Duration (in years)" value={newCourse.duration_years} onChange={(e) => setNewCourse({ ...newCourse, duration_years: e.target.value })} />
          <input type="number" placeholder="Fees (₹)" value={newCourse.fees} onChange={(e) => setNewCourse({ ...newCourse, fees: e.target.value })} />
          
          {/* 🚨 FIX 3: REMOVED THE ELIGIBILITY ID INPUT FIELD FROM JSX */}
          
          <button onClick={handleAddCourse}>Add Course</button>
        </div>
      </section>

      {/* COURSE LIST SECTION */}
      <section className="course-list">
        <h3>Existing Courses</h3>
        <ul>
          {courses.map((course) => {
            const college = colleges.find((c) => c.college_id === course.college_id);
            return (
              <li key={course.course_id}>
                <strong>{course.course_name}</strong> — {college?.name}
                <button className="delete-btn" onClick={() => handleDeleteCourse(course.course_id)}>
                  Delete
                </button>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
};

export default CoursePage;