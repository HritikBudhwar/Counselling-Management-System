// src/components/student/StudentSidebar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './StudentSidebar.css'; // Create this CSS file

const StudentSidebar = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    
    // Determine current step for visual cues
    // NOTE: In a real app, you'd check the DB to see which step is complete.
    // Here we use the URL for basic navigation.

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="student-sidebar">
            <div className="profile-info">
                <h3>{user?.username || 'Student'}</h3>
                <p>{user?.email}</p>
            </div>
            
            <nav className="student-nav-steps">
                <h4>Application Steps</h4>
                <Link to="/dashboard" className="sidebar-link">
                    1. 📝 Profile Details
                </Link>
                <Link to="/dashboard/marks" className="sidebar-link">
                    2. 📈 Exam Marks
                </Link>
                <Link to="/dashboard/preferences" className="sidebar-link">
                    3. 🎯 Choose Preferences
                </Link>
                <Link to="/dashboard/profile" className="sidebar-link status-link">
                    4. 📄 View Profile & Status
                </Link>
                
                {/* SETTINGS (You can expand this later) */}
                <h4 className="settings-heading">Account</h4>
                <Link to="/dashboard/settings" className="sidebar-link">
                    ⚙️ Settings (Change Password)
                </Link>
            </nav>

            <button onClick={handleLogout} className="logout-btn">
                ➡️ Logout
            </button>
        </div>
    );
};

export default StudentSidebar;