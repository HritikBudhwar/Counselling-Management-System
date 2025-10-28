import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AdminSidebar.css'; // Create this CSS file for styling

const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };
  return (
    <div className="admin-sidebar">
      <h2>Admin Panel</h2>
      <nav>
        <Link to="/admin-dashboard" className="sidebar-link">📊 Dashboard Home</Link>
        <Link to="/admin/colleges" className="sidebar-link">🏛️ Manage Colleges</Link>
        <Link to="/admin/courses" className="sidebar-link">📚 Manage Courses</Link>
        <Link to="/admin/students" className="sidebar-link">🧑‍🎓 Manage Students</Link>
        <Link to="/admin/counseling" className="sidebar-link">📅 Counseling Setup</Link>
        <Link to="/admin/allocate" className='sidebar-link'>Seat Allocation</Link>
      </nav>
      <button onClick={handleLogout} className="logout-btn">
        Logout
      </button>
    </div>
  );
};

export default AdminSidebar;