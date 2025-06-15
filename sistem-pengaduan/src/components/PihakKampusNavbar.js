// src/components/PihakKampusNavbar.js
import React, { useEffect, useState } from 'react'; // Tambahkan useEffect, useState
import { Link, useNavigate } from 'react-router-dom';
import './PihakKampusNavbar.css';

const PihakKampusNavbar = () => {
  const navigate = useNavigate();
  // State untuk nama kampus agar bisa reaktif jika PihakKampusLayout menyimpannya
  const [namaKampusDisplay, setNamaKampusDisplay] = useState('Pihak Kampus');

  useEffect(() => {
    // Fungsi untuk update nama dari localStorage
    const updateNama = () => {
      const storedNama = localStorage.getItem('current_nama_kampus_institusi');
      if (storedNama) {
        setNamaKampusDisplay(storedNama);
      } else {
        setNamaKampusDisplay('Pihak Kampus'); // Fallback jika belum ada
      }
    };

    updateNama(); // Panggil saat mount

    // Listener untuk perubahan localStorage (opsional, untuk update instan jika ada tab lain)
    // Namun, PihakKampusLayout seharusnya sudah mengatur ini sebelum navbar dirender dengan data benar.
    // Untuk kasus ini, pemanggilan saat mount dan re-render PihakKampusLayout sudah cukup.
    // window.addEventListener('storage', updateNama);
    // return () => window.removeEventListener('storage', updateNama);
  }, []);


  const handleLogout = () => {
    localStorage.removeItem('user_id');
    localStorage.removeItem('username');
    localStorage.removeItem('wargaKampus_nama'); // Hapus yang lama
    localStorage.removeItem('current_pihak_kampus_id'); // Hapus yang baru
    localStorage.removeItem('current_nama_kampus_institusi'); // Hapus yang baru
    sessionStorage.removeItem('is_staff');
    navigate('/');
  };

  return (
    <nav className="pk-navbar">
      <div className="pk-navbar-brand">
        <Link to="/pihakkampus">EL-Lapor Kampus</Link>
      </div>
      <div className="pk-navbar-links">
        <Link to="/pihakkampus/pengaduan" className="pk-nav-link">Pengaduan Kampus</Link>
        <Link to="/pihakkampus/profil" className="pk-nav-link">Data Diri</Link>
      </div>
      <div className="pk-navbar-user">
        <span>Halo, {namaKampusDisplay}</span>
        <button onClick={handleLogout} className="pk-nav-button pk-logout-button">Logout</button>
      </div>
    </nav>
  );
};

export default PihakKampusNavbar;