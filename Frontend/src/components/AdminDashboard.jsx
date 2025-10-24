// // src/components/AdminDashboard.jsx
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "./AdminDashboard.css";

// const AdminDashboard = () => {
//   const [colleges, setColleges] = useState([]);
//   const [courses, setCourses] = useState([]);

//   const [newCollege, setNewCollege] = useState({
//     name: "",
//     location: "",
//     college_type: "",
//     affiliation: "",
//   });

//   const [newCourse, setNewCourse] = useState({
//     college_id: "",
//     course_name: "",
//     duration_years: "",
//     fees: "",
//     eligibility_id: "",
//   });

//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     fetchColleges();
//     fetchCourses();
//   }, []);

//   // Fetch all colleges
//   const fetchColleges = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/colleges");
//       setColleges(res.data);
//     } catch (err) {
//       console.error("Error fetching colleges:", err);
//     }
//   };

//   // Fetch all courses
//   const fetchCourses = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/courses");
//       setCourses(res.data);
//     } catch (err) {
//       console.error("Error fetching courses:", err);
//     }
//   };

//   // Add new college
//   const handleAddCollege = async () => {
//     if (!newCollege.name || !newCollege.location) {
//       alert("College name and location are required.");
//       return;
//     }

//     try {
//       await axios.post(
//         "http://localhost:5000/api/colleges",
//         newCollege,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setNewCollege({ name: "", location: "", college_type: "", affiliation: "" });
//       alert("College added successfully!");
//       fetchColleges();
//     } catch (err) {
//       console.error("Error adding college:", err);
//       alert("Failed to add college. Check backend route or DB connection.");
//     }
//   };

//   // Add new course
//   const handleAddCourse = async () => {
//     if (!newCourse.college_id || !newCourse.course_name) {
//       alert("Select college and enter course name.");
//       return;
//     }

//     try {
//       await axios.post(
//         "http://localhost:5000/add/courses",
//         newCourse,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setNewCourse({ college_id: "", course_name: "", duration_years: "", fees: "", eligibility_id: "" });
//       alert("Course added successfully!");
//       fetchCourses();
//     } catch (err) {
//       console.error("Error adding course:", err);
//       alert("Failed to add course. Check backend route or DB connection.");
//     }
//   };

//   // Delete college
//   const handleDeleteCollege = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this college?")) return;
//     try {
//       await axios.delete(`http://localhost:5000/api/colleges/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       fetchColleges();
//     } catch (err) {
//       console.error("Error deleting college:", err);
//     }
//   };

//   // Delete course
//   const handleDeleteCourse = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this course?")) return;
//     try {
//       await axios.delete(`http://localhost:5000/api/courses/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       fetchCourses();
//     } catch (err) {
//       console.error("Error deleting course:", err);
//     }
//   };

//   return (
//     <div className="admin-dashboard">
//       <h1>Admin Dashboard</h1>

//       {/* ADD COLLEGE */}
//       <section className="add-section">
//         <h2>Add College</h2>
//         <div className="form-group">
//           <input
//             type="text"
//             placeholder="College Name"
//             value={newCollege.name}
//             onChange={(e) => setNewCollege({ ...newCollege, name: e.target.value })}
//           />
//           <input
//             type="text"
//             placeholder="Location"
//             value={newCollege.location}
//             onChange={(e) => setNewCollege({ ...newCollege, location: e.target.value })}
//           />
//           <input
//             type="text"
//             placeholder="College Type (Government/Private)"
//             value={newCollege.college_type}
//             onChange={(e) => setNewCollege({ ...newCollege, college_type: e.target.value })}
//           />
//           <input
//             type="text"
//             placeholder="Affiliation (IIT/NIT/VTU/etc)"
//             value={newCollege.affiliation}
//             onChange={(e) => setNewCollege({ ...newCollege, affiliation: e.target.value })}
//           />
//           <button onClick={handleAddCollege}>Add College</button>
//         </div>
//       </section>

//       {/* ADD COURSE */}
//       <section className="add-section">
//         <h2>Add Course</h2>
//         <div className="form-group">
//           <select
//             value={newCourse.college_id}
//             onChange={(e) => setNewCourse({ ...newCourse, college_id: e.target.value })}
//           >
//             <option value="">Select College</option>
//             {colleges.map((college) => (
//               <option key={college.college_id} value={college.college_id}>
//                 {college.name}
//               </option>
//             ))}
//           </select>

//           <input
//             type="text"
//             placeholder="Course Name"
//             value={newCourse.course_name}
//             onChange={(e) => setNewCourse({ ...newCourse, course_name: e.target.value })}
//           />
//           <input
//             type="number"
//             placeholder="Duration (in years)"
//             value={newCourse.duration_years}
//             onChange={(e) => setNewCourse({ ...newCourse, duration_years: e.target.value })}
//           />
//           <input
//             type="number"
//             placeholder="Fees (₹)"
//             value={newCourse.fees}
//             onChange={(e) => setNewCourse({ ...newCourse, fees: e.target.value })}
//           />
//           <input
//             type="number"
//             placeholder="Eligibility ID"
//             value={newCourse.eligibility_id}
//             onChange={(e) => setNewCourse({ ...newCourse, eligibility_id: e.target.value })}
//           />
//           <button onClick={handleAddCourse}>Add Course</button>
//         </div>
//       </section>

//       {/* COLLEGE LIST */}
//       <section className="college-list">
//         <h2>All Colleges</h2>
//         <ul>
//           {colleges.map((college) => (
//             <li key={college.college_id}>
//               <strong>{college.name}</strong> — {college.location} ({college.college_type})
//               <button className="delete-btn" onClick={() => handleDeleteCollege(college.college_id)}>
//                 Delete
//               </button>
//             </li>
//           ))}
//         </ul>
//       </section>

//       {/* COURSE LIST */}
//       <section className="course-list">
//         <h2>All Courses</h2>
//         <ul>
//           {courses.map((course) => {
//             const college = colleges.find((c) => c.college_id === course.college_id);
//             return (
//               <li key={course.course_id}>
//                 <strong>{course.course_name}</strong> — {college?.name} ({course.duration_years} yrs, ₹{course.fees})
//                 <button className="delete-btn" onClick={() => handleDeleteCourse(course.course_id)}>
//                   Delete
//                 </button>
//               </li>
//             );
//           })}
//         </ul>
//       </section>
//     </div>
//   );
// };

// export default AdminDashboard;



// src/components/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [colleges, setColleges] = useState([]);
  const [courses, setCourses] = useState([]);

  const [newCollege, setNewCollege] = useState({
    name: "",
    location: "",
    college_type: "",
    affiliation: "",
  });

  const [newCourse, setNewCourse] = useState({
    college_id: "",
    course_name: "",
    duration_years: "",
    fees: "",
    eligibility_id: "",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchColleges();
    fetchCourses();
  }, []);

  // Fetch all colleges
  const fetchColleges = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/colleges");
      setColleges(res.data);
    } catch (err) {
      console.error("Error fetching colleges:", err);
    }
  };

  // Fetch all courses
  const fetchCourses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/courses");
      setCourses(res.data);
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  // Add new college
  const handleAddCollege = async () => {
    if (!newCollege.name || !newCollege.location) {
      alert("College name and location are required.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/colleges",
        newCollege,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewCollege({ name: "", location: "", college_type: "", affiliation: "" });
      alert("College added successfully!");
      fetchColleges();
    } catch (err) {
      console.error("Error adding college:", err);
      alert("Failed to add college. Check backend route or DB connection.");
    }
  };

  // Add new course
  const handleAddCourse = async () => {
    if (!newCourse.college_id || !newCourse.course_name) {
      alert("Select college and enter course name.");
      return;
    }

    try {
      await axios.post(
        // 🚨 MODIFIED LINK: Changed from /add/courses to /api/courses/add
        "http://localhost:5000/api/courses/add", 
        newCourse,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewCourse({ college_id: "", course_name: "", duration_years: "", fees: "", eligibility_id: "" });
      alert("Course added successfully!");
      fetchCourses();
    } catch (err) {
      console.error("Error adding course:", err);
      alert("Failed to add course. Check backend route or DB connection.");
    }
  };

  // Delete college
  const handleDeleteCollege = async (id) => {
    if (!window.confirm("Are you sure you want to delete this college?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/colleges/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchColleges();
    } catch (err) {
      console.error("Error deleting college:", err);
    }
  };

  // Delete course
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
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      {/* ADD COLLEGE */}
      <section className="add-section">
        <h2>Add College</h2>
        <div className="form-group">
          <input
            type="text"
            placeholder="College Name"
            value={newCollege.name}
            onChange={(e) => setNewCollege({ ...newCollege, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Location"
            value={newCollege.location}
            onChange={(e) => setNewCollege({ ...newCollege, location: e.target.value })}
          />
          <input
            type="text"
            placeholder="College Type (Government/Private)"
            value={newCollege.college_type}
            onChange={(e) => setNewCollege({ ...newCollege, college_type: e.target.value })}
          />
          <input
            type="text"
            placeholder="Affiliation (IIT/NIT/VTU/etc)"
            value={newCollege.affiliation}
            onChange={(e) => setNewCollege({ ...newCollege, affiliation: e.target.value })}
          />
          <button onClick={handleAddCollege}>Add College</button>
        </div>
      </section>

      {/* ADD COURSE */}
      <section className="add-section">
        <h2>Add Course</h2>
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

          <input
            type="text"
            placeholder="Course Name"
            value={newCourse.course_name}
            onChange={(e) => setNewCourse({ ...newCourse, course_name: e.target.value })}
          />
          <input
            type="number"
            placeholder="Duration (in years)"
            value={newCourse.duration_years}
            onChange={(e) => setNewCourse({ ...newCourse, duration_years: e.target.value })}
          />
          <input
            type="number"
            placeholder="Fees (₹)"
            value={newCourse.fees}
            onChange={(e) => setNewCourse({ ...newCourse, fees: e.target.value })}
          />
          <input
            type="number"
            placeholder="Eligibility ID"
            value={newCourse.eligibility_id}
            onChange={(e) => setNewCourse({ ...newCourse, eligibility_id: e.target.value })}
          />
          <button onClick={handleAddCourse}>Add Course</button>
        </div>
      </section>

      {/* COLLEGE LIST */}
      <section className="college-list">
        <h2>All Colleges</h2>
        <ul>
          {colleges.map((college) => (
            <li key={college.college_id}>
              <strong>{college.name}</strong> — {college.location} ({college.college_type})
              <button className="delete-btn" onClick={() => handleDeleteCollege(college.college_id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* COURSE LIST */}
      <section className="course-list">
        <h2>All Courses</h2>
        <ul>
          {courses.map((course) => {
            const college = colleges.find((c) => c.college_id === course.college_id);
            return (
              <li key={course.course_id}>
                <strong>{course.course_name}</strong> — {college?.name} ({course.duration_years} yrs, ₹{course.fees})
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

export default AdminDashboard;