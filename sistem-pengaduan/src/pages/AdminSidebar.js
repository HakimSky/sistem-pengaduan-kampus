import React from "react";
import { Link } from "react-router-dom"; // Import Link untuk navigasi
import {
  FiGrid,
  FiCheckCircle, // FiMail dihapus karena tidak dipakai, FiCheckCircle digunakan untuk Verifikasi
  FiUser,
  FiImage,
} from "react-icons/fi";
import "./AdminSidebar.css";

const AdminSidebar = () => {
  return (
    <div className="pk-sidebar">
      <h1 className="pk-sidebar-title">El-Lapor</h1>

      <nav className="pk-sidebar-menu">
        <Link to="/admin/" className="pk-menu-item" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="pk-menu-item">
            <div className="pk-icon-wrapper">
              <FiGrid />
            </div>
            <span>Dashboard</span>
        </div>
        </Link>

        {/* Verifikasi - Sebelumnya Pesan, dengan navigasi */}
        <Link to="/admin/verifikasi" className="pk-menu-item" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="pk-icon-wrapper">
            <FiCheckCircle /> {/* Ikon diubah ke FiCheckCircle */}
          </div>
          <span>Verifikasi</span> {/* Teks diubah ke Verifikasi */}
        </Link>

        {/* Akun - Sebelumnya User, dengan navigasi */}
        <Link to="/admin/akun" className="pk-menu-item" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="pk-icon-wrapper">
            <FiUser />
          </div>
          <span>Akun</span> {/* Teks diubah ke Akun */}
        </Link>

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