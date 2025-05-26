// AdminSidebar.jsx
import React from "react";
import {
  FiGrid,
  FiMail,
  FiCheckCircle,
  FiUser,
  FiImage,
} from "react-icons/fi";
import "./AdminSidebar.css";

const AdminSidebar = () => {
  return (
    <div className="pk-sidebar">
      <h1 className="pk-sidebar-title">El-Lapor</h1>

      <nav className="pk-sidebar-menu">
        <div className="pk-menu-item">
          <div className="pk-icon-wrapper"><FiGrid /></div>
          <span>Dashboard</span>
        </div>
        <div className="pk-menu-item">
          <div className="pk-icon-wrapper"><FiMail /></div>
          <span>Pesan</span>
        </div>
        <div className="pk-menu-item">
          <div className="pk-icon-wrapper"><FiCheckCircle /></div>
          <span>Complete</span>
        </div>
        <div className="pk-menu-item">
          <div className="pk-icon-wrapper"><FiUser /></div>
          <span>User</span>
        </div>
        <div className="pk-menu-item">
          <div className="pk-icon-wrapper"><FiImage /></div>
          <span>Image</span>
        </div>
      </nav>

      <div className="pk-sidebar-footer">
        <span>Feedback</span>
        <span>Terms</span>
        <span>Help</span>
      </div>
    </div>
  );
};

export default AdminSidebar;
