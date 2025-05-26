import React from 'react';
import './Pengaduan.css';
import { FiTag, FiFileText, FiFile, FiMapPin, FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';    
// import Select from 'react-select';

const Pengaduan = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      <div className="formulir-container">
        <div className="formulir-box">
          <div className="formulir-header">
            <button className="btn-back" onClick={() => navigate(-1)}>
              <FiArrowLeft />
            </button>
          </div>
          <div className="formulir-header1">
              <h2>Laporan Masalah</h2>
          </div>

          <div className="input-icon">
            <FiTag />
            <select>
              <option value="">Pilih Kategori</option>
              <option value="Jalan Berlubang">Jalan Berlubang</option>
              <option value="Kursi Rusak">Kursi Rusak</option>
              <option value="Lantai Rusak">Lantai Rusak</option>
              <option value="Pintu Rusak">Pintu Rusak</option>
              <option value="Toilet Rusak">Toilet Rusak</option>
            </select>
          </div>

          <div className="input-icon">
            <FiFileText />
            <textarea placeholder="Deskripsi" />
          </div>

          <div className="input-icon">
            <FiFile />
            <input type="file" />
          </div>

          <div className="input-icon">
            <FiMapPin />
            <input type="text" placeholder="Lokasi" />
          </div>

          <button className="btn-submit">Kirim</button>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p className="footer-copy">&copy; 2025 El-Lapor. Semua Hak Dilindungi.</p>
          <p className="footer-links">
            <a href="/kebijakan">Kebijakan Privasi</a> |
            <a href="/bantuan">Bantuan</a> |
            <a href="/kontak">Kontak</a>
          </p>
        </div>
      </footer>
    </>
  );
};

export default Pengaduan;
