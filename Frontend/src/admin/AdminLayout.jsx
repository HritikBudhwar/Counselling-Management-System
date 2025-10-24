// src/components/admin/AdminLayout.jsx
import React from 'react';
import AdminSidebar from './AdminSidebar';
import './AdminLayout.css'; // For basic layout (sidebar/content split)

const AdminLayout = ({ children }) => {
  // NOTE: Role validation is handled by the <PrivateRoute> in App.jsx now.
  // This component focuses only on the layout structure.

  return (
    <div className="admin-layout-wrapper">
      <AdminSidebar />
      <main className="admin-content">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
