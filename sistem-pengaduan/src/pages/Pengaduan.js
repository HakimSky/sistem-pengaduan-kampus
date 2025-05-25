import React, { useState, useEffect } from 'react';
import './Pengaduan.css';
import { FiTag, FiFileText, FiFile, FiMapPin, FiArrowLeft, FiUser, FiCalendar } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Pengaduan = () => {
  const navigate = useNavigate();

  // State untuk form
  const [kategori, setKategori] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [gambar, setGambar] = useState(null);
  const [lokasi, setLokasi] = useState('');
  const [tanggalKejadian, setTanggalKejadian] = useState('');

  // State untuk pelapor (id warga kampus)
  const [wargaKampusId, setWargaKampusId] = useState(null);
  const [wargaKampusNama, setWargaKampusNama] = useState('');

  // Proteksi halaman: jika belum login, redirect ke login
  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      alert('Anda harus login terlebih dahulu!');
      navigate('/login');
      return;
    }

    // Fetch data warga kampus berdasarkan user_id
    fetch('http://127.0.0.1:8000/api/warga-kampus/warga-kampus/')
      .then(res => res.json())
      .then(data => {
        const userProfile = data.find(item => item.user == userId);
        if (userProfile) {
          setWargaKampusId(userProfile.id);
          setWargaKampusNama(userProfile.nama); // Tampilkan nama pelapor
        }
      })
      .catch(err => console.error('Error fetching warga kampus:', err));
  }, [navigate]);

  // Handle submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!wargaKampusId) {
      alert('Gagal mengirim laporan: pelapor tidak ditemukan!');
      return;
    }

    const formData = new FormData();
    formData.append('kategori', kategori);
    formData.append('deskripsi', deskripsi);
    if (gambar) {
      formData.append('gambar', gambar);
    }
    formData.append('lokasi', lokasi);
    formData.append('tanggal_kejadian', tanggalKejadian);
    formData.append('pelapor', wargaKampusId); // kirim id warga kampus, bukan nama

    try {
      const response = await fetch('http://127.0.0.1:8000/api/pengaduan/pengaduan/', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Pengaduan berhasil dikirim!');
        // Reset form
        setKategori('');
        setDeskripsi('');
        setGambar(null);
        setLokasi('');
        setTanggalKejadian('');
      } else {
        alert('Gagal mengirim pengaduan.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan saat mengirim pengaduan.');
    }
  };

  return (
    <>
      <Navbar />

      <div className="formulir-container">
        <div className="formulir-box">
          {/* Header */}
          <div className="formulir-header">
            <button className="btn-back" onClick={() => navigate(-1)}>
              <FiArrowLeft />
            </button>
          </div>
          <div className="formulir-header1">
            <h2>Laporan Masalah</h2>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="input-icon">
              <FiUser />
              <input
                type="text"
                placeholder="Pelapor"
                value={wargaKampusNama}
                readOnly
              />
            </div>

            <div className="input-icon">
              <FiTag />
              <input
                type="text"
                placeholder="Kategori"
                value={kategori}
                onChange={(e) => setKategori(e.target.value)}
                required
              />
            </div>

            <div className="input-icon">
              <FiFileText />
              <textarea
                placeholder="Deskripsi"
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                required
              />
            </div>

            <div className="input-icon">
              <FiFile />
              <input
                type="file"
                onChange={(e) => setGambar(e.target.files[0])}
              />
            </div>

            <div className="input-icon">
              <FiMapPin />
              <input
                type="text"
                placeholder="Lokasi"
                value={lokasi}
                onChange={(e) => setLokasi(e.target.value)}
                required
              />
            </div>

            <div className="input-icon">
              <FiCalendar />
              <input
                type="date"
                value={tanggalKejadian}
                onChange={(e) => setTanggalKejadian(e.target.value)}
                required
              />
            </div>

            <button className="btn-submit" type="submit">
              Kirim
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Pengaduan;
