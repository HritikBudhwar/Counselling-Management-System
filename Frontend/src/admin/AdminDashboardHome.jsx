// src/components/admin/AdminDashboardHome.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboardHome = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="admin-dashboard-home">
      <h2>Welcome, {user?.username || 'Admin'}!</h2>
      <p>This is your control panel. Use the sidebar to manage core data.</p>
      
      {/* Quick Links / Summary Stats */}
      <div className="dashboard-summary-cards">
        <div className="card">
          <h3>Colleges</h3>
          <p>Manage all institutions.</p>
          <Link to="/admin/colleges">Go to Colleges →</Link>
        </div>
        <div className="card">
          <h3>Courses</h3>
          <p>Add, edit, and remove course offerings.</p>
          <Link to="/admin/courses">Go to Courses →</Link>
        </div>
        <div className="card">
          <h3>Students</h3>
          <p>Review and manage student profiles.</p>
          <Link to="/admin/students">Go to Students →</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardHome;