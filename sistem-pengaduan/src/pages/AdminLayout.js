// AdminLayout.jsx
import React, { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar'; // Sesuaikan path jika perlu
import { FiMenu, FiX } from 'react-icons/fi'; // Untuk ikon hamburger
import './AdminLayout.css';

const AdminLayout = ({ children, pageTitle }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsMobileSidebarOpen(false); // Tutup sidebar mobile jika layar membesar
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Asumsi AdminSidebar.jsx memiliki prop 'isOpen' dan 'isMobile'
  // dan class CSS .pk-sidebar.mobile-open
  // Jika AdminSidebar.jsx Anda berbeda, penyesuaian diperlukan di sana.

  return (
    <div className={`admin-layout ${isMobileSidebarOpen ? 'mobile-sidebar-active' : ''}`}>
      {/* Render AdminSidebar secara kondisional atau biarkan CSS yang menanganinya.
        Untuk drawer, biasanya sidebar tetap di DOM dan dikontrol oleh class.
      */}
      <AdminSidebar isOpen={!isMobileView || isMobileSidebarOpen} isMobile={isMobileView} toggleSidebar={isMobileView ? toggleMobileSidebar : undefined} />
      
      <main className="admin-main-content">
        {isMobileView && (
          <button className="pk-hamburger-layout" onClick={toggleMobileSidebar} aria-label="Toggle Menu">
            {isMobileSidebarOpen ? <FiX /> : <FiMenu />}
          </button>
        )}
        <div className="admin-content-wrapper">
          {pageTitle && <h1 className="admin-page-title">{pageTitle}</h1>}
          <div className="admin-content-area">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

// Tambahkan CSS untuk .pk-hamburger-layout jika berbeda dari .pk-hamburger di AdminSidebar
// Atau pastikan .pk-hamburger di AdminSidebar bisa di-override posisinya.
// CSS untuk .admin-main-content.with-hamburger dan .admin-layout.mobile-sidebar-active
// perlu ditambahkan di AdminLayout.css untuk menggeser konten atau menampilkan overlay.

export default AdminLayout;
