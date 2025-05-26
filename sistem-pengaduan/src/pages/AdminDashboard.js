// AdminDashboard.jsx
import React from "react";
import AdminSidebar from "./AdminSidebar";

const AdminDashboard = () => {
  return (
    <div style={{ display: "flex" }}>
      <AdminSidebar />
      <div style={{ flex: 1, padding: "40px" }}>
        {/* Konten utama dashboard di sini */}
        <h2>Selamat datang di Admin Dashboard</h2>
      </div>
    </div>
  );
};

export default AdminDashboard;
