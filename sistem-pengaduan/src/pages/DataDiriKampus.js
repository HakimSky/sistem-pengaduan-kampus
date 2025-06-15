// src/pages/pihakKampus/DataDiriKampus.js
import React, { useEffect, useState } from 'react';
import './PihakKampus.css';
import { FiBriefcase, FiUser, FiAlertCircle } from 'react-icons/fi'; // Contoh ikon

const DataDiriKampus = () => {
  const [pihakKampusData, setPihakKampusData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const pihakKampusId = localStorage.getItem('current_pihak_kampus_id'); // Gunakan kunci baru
    const usernameAkun = localStorage.getItem('username');

    if (!pihakKampusId) {
      setError("ID Pihak Kampus tidak tersedia di localStorage. Tidak dapat memuat profil.");
      setLoading(false);
      return;
    }

    setLoading(true);
    // Fetch ke endpoint DETAIL PihakKampus
    fetch(`http://127.0.0.1:8000/api/pihak-kampus/pihak-kampus/${pihakKampusId}/`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Gagal mengambil data profil Pihak Kampus: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        setPihakKampusData({...data, username_akun_login: usernameAkun}); // Simpan data dari API dan tambahkan username login
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching data diri kampus (detail):", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="pk-page-loader">
        <div className="pk-loader"></div>
        <span>Memuat Profil Pihak Kampus...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2 className="pk-page-title">Profil Pihak Kampus</h2>
        <p className="pk-error-message">{error}</p>
      </div>
    );
  }

  if (!pihakKampusData) {
    return (
      <div>
        <h2 className="pk-page-title">Profil Pihak Kampus</h2>
        <p className="pk-empty-state">Data profil untuk Pihak Kampus tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="pk-page-title">Profil Pihak Kampus</h2>
      <div className="pk-card-modern detail-view" style={{ marginTop: 0 }}>
        <div className="pk-detail-section">
          <strong className="pk-detail-section-title"><FiBriefcase /> Informasi Institusi/Unit</strong>
          {/* Sesuaikan field dengan yang ada di API detail PihakKampusmu */}
          <p><strong>Nama Institusi/Unit:</strong> {pihakKampusData.nama_kampus || "N/A"}</p>
          <p><strong>Departemen:</strong> {pihakKampusData.department || "N/A"}</p>
          <p><strong>Posisi:</strong> {pihakKampusData.position || "N/A"}</p>
        </div>
        <div className="pk-detail-section">
          <strong className="pk-detail-section-title"><FiUser /> Akun Terkait</strong>
          <p><strong>Username Akun Login:</strong> {pihakKampusData.username_akun_login || "N/A"}</p>
          {/* <p><strong>ID User Django Terkait:</strong> {pihakKampusData.user || "N/A"}</p> */}
          {/* Jika API detail mengirimkan email dari user Django terkait: */}
          {/* <p><strong>Email User:</strong> {pihakKampusData.user_email || "N/A"}</p> */}
        </div>
      </div>
    </div>
  );
};

export default DataDiriKampus;