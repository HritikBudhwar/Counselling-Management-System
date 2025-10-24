import React, { useState, useEffect } from "react";
import axios from "axios";
import './CollegePage.css'

const CollegePage = () => {
  const [colleges, setColleges] = useState([]);
  const [newCollege, setNewCollege] = useState({ name: "", location: "", college_type: "", affiliation: "" });
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchColleges();
  }, []);

   const fetchColleges = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/colleges");
      setColleges(res.data);
    } catch (err) {
      console.error("Error fetching colleges:", err);
    }
  };
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


  return (
    <div className="college-management">
      <h2>🏛️ College Management</h2>
      <section className="add-section">
        <h3>Add New College</h3>
        <div className="form-group">
          {/* ... (Input fields for newCollege go here, using setNewCollege) ... */}
          <input type="text" placeholder="College Name" value={newCollege.name} onChange={(e) => setNewCollege({ ...newCollege, name: e.target.value })} />
          <input type="text" placeholder="Location" value={newCollege.location} onChange={(e) => setNewCollege({ ...newCollege, location: e.target.value })} />
          <input type="text" placeholder="College Type" value={newCollege.college_type} onChange={(e) => setNewCollege({ ...newCollege, college_type: e.target.value })} />
          <input type="text" placeholder="Affiliation" value={newCollege.affiliation} onChange={(e) => setNewCollege({ ...newCollege, affiliation: e.target.value })} />
          <button onClick={handleAddCollege}>Add College</button>
        </div>
      </section>
      <section className="college-list">
        <h3>Existing Colleges</h3>
        <ul>
          {colleges.map((college) => (
            <li key={college.college_id}>
              <strong>{college.name}</strong> — {college.location}
              <button className="delete-btn" onClick={() => handleDeleteCollege(college.college_id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default CollegePage;