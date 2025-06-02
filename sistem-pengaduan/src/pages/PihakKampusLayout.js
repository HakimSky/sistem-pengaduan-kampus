// src/pages/pihakKampus/PihakKampusLayout.js
import React, { useEffect, useState } from 'react';
import { Outlet, Navigate, Link } from 'react-router-dom';
import PihakKampusNavbar from '../components/PihakKampusNavbar';
import Footer from '../components/Footer';
import './PihakKampus.css';

const PihakKampusLayout = () => {
  const [isPihakKampusIdentified, setIsPihakKampusIdentified] = useState(false);
  const [identificationError, setIdentificationError] = useState(null);
  const [isLoadingIdentification, setIsLoadingIdentification] = useState(true);

  // Logika proteksi rute awal (misalnya, apakah username ada)
  const username = localStorage.getItem('username');
  const isStaff = sessionStorage.getItem('is_staff') === 'true';
  const isPihakKampusUserLogin = username?.toLowerCase() === 'ums_x_1' && !isStaff; // Kondisi awal

  useEffect(() => {
    if (!isPihakKampusUserLogin) {
      setIsLoadingIdentification(false);
      return; // Tidak perlu identifikasi lebih lanjut jika bukan user pihak kampus dari login
    }

    // Cek apakah data identitas pihak kampus sudah ada di localStorage
    const storedPihakKampusId = localStorage.getItem('current_pihak_kampus_id');
    const storedNamaKampus = localStorage.getItem('current_nama_kampus_institusi');

    if (storedPihakKampusId && storedNamaKampus) {
      setIsPihakKampusIdentified(true);
      setIsLoadingIdentification(false);
      return;
    }

    // Jika belum ada, fetch untuk identifikasi
    const loggedInUserId = localStorage.getItem('user_id');
    if (!loggedInUserId) {
      setIdentificationError("User ID tidak ditemukan untuk identifikasi Pihak Kampus.");
      setIsLoadingIdentification(false);
      return;
    }

    fetch('http://127.0.0.1:8000/api/pihak-kampus/pihak-kampus/')
      .then(response => {
        if (!response.ok) {
          throw new Error('Gagal mengambil daftar Pihak Kampus untuk identifikasi.');
        }
        return response.json();
      })
      .then(pihakKampusList => {
        // API mengembalikan list, atau objek dengan 'results' jika ada paginasi
        const listData = Array.isArray(pihakKampusList) ? pihakKampusList : pihakKampusList.results || [];
        
        const foundPihakKampus = listData.find(
          pk => pk.user && pk.user.toString() === loggedInUserId // pk.user adalah ID User Django
        );

        if (foundPihakKampus) {
          localStorage.setItem('current_pihak_kampus_id', foundPihakKampus.id);
          localStorage.setItem('current_nama_kampus_institusi', foundPihakKampus.nama_kampus); // Asumsi field 'nama_kampus' ada
          setIsPihakKampusIdentified(true);
        } else {
          setIdentificationError(`Data Pihak Kampus untuk user ID ${loggedInUserId} tidak ditemukan.`);
          // Hapus item lama jika ada dan tidak valid lagi
          localStorage.removeItem('current_pihak_kampus_id');
          localStorage.removeItem('current_nama_kampus_institusi');
        }
      })
      .catch(err => {
        console.error("Error identifikasi Pihak Kampus:", err);
        setIdentificationError(err.message);
      })
      .finally(() => {
        setIsLoadingIdentification(false);
      });

  }, [isPihakKampusUserLogin]); // Jalankan efek ini jika status login pihak kampus berubah

  if (!isPihakKampusUserLogin) {
    // Jika dari awal bukan user pihak kampus yang seharusnya, redirect
    return <Navigate to="/login" replace />;
  }

  if (isLoadingIdentification) {
    return (
      <div className="pk-page-loader">
        <div className="pk-loader"></div>
        <span>Mengidentifikasi Pihak Kampus...</span>
      </div>
    );
  }

  if (identificationError) {
    return (
      <div className="pk-dashboard-layout">
        <PihakKampusNavbar /> {/* Navbar mungkin masih bisa ditampilkan dengan nama default */}
        <main className="pk-main-content">
          <h2 className="pk-page-title">Error Identifikasi</h2>
          <p className="pk-error-message">Tidak dapat mengidentifikasi detail Pihak Kampus: {identificationError}</p>
          <p>Pastikan akun Anda terdaftar dengan benar sebagai Pihak Kampus, atau coba <Link to="/login" onClick={() => localStorage.clear()}>login ulang</Link>.</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isPihakKampusIdentified) {
     // Kasus di mana identifikasi selesai tapi tidak menemukan data Pihak Kampus yang cocok
     // Ini seharusnya sudah ditangani oleh `identificationError` di atas, tapi sebagai fallback
    return (
        <div className="pk-dashboard-layout">
          <PihakKampusNavbar />
          <main className="pk-main-content">
            <h2 className="pk-page-title">Gagal Identifikasi</h2>
            <p className="pk-error-message">Tidak dapat menemukan data spesifik Pihak Kampus untuk akun Anda.</p>
             <p>Pastikan akun Anda terdaftar dengan benar sebagai Pihak Kampus, atau coba <Link to="/login" onClick={() => localStorage.clear()}>login ulang</Link>.</p>
          </main>
          <Footer />
        </div>
      );
  }

  // Jika identifikasi berhasil (atau sudah ada di localStorage), tampilkan layout utama
  return (
    <div className="pk-dashboard-layout">
      <PihakKampusNavbar />
      <main className="pk-main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PihakKampusLayout;