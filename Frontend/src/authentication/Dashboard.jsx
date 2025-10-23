// src/pages/Dashboard.jsx
import './Dashboard.css'
import React, { useEffect, useState } from "react";
import CollegeList from "../college/collegeList";
// import CoursesList from "../components/CoursesList";
// import CounselingList from "../components/CounselingList";
import AdminDashboard from "../components/AdminDashboard";


const Dashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="dashboard-container">
      <h1>Welcome, {user.username}</h1>
      {user.role === "admin" ? (
        <AdminDashboard />
      ) : (
        <div className="student-view">
          <h2>Available Colleges</h2>
          <CollegeList />
          <h2>Available Courses</h2>
          <CoursesList />
          <h2>Counseling Events</h2>
          <CounselingList />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
