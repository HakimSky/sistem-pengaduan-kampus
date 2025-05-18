import React, { useState } from 'react';
import './Riwayat.css';
import Navbar from '../components/Navbar';
import { FiClock, FiSettings, FiCheckCircle } from 'react-icons/fi';

const laporanDummy = [
  {
    id: 1,
    kategori: 'Jalan Berlubang',
    status: 'Menunggu',
    lokasi: 'Depan gedung J',
    gambar: '/assets/jalan.jpg',
    tanggal: '17/03/2022'
  },
  {
    id: 2,
    kategori: 'Toilet Rusak',
    status: 'Proses',
    lokasi: 'Toilet Pria Gedung J',
    gambar: '/assets/toilet.jpg',
    tanggal: '18/03/2022'
  },
  {
    id: 3,
    kategori: 'Kursi Rusak',
    status: 'Selesai',
    lokasi: 'J5em',
    gambar: '/assets/kursi.jpg',
    tanggal: '11/01/2022'
  },
  {
    id: 4,
    kategori: 'Lantai Rusak',
    status: 'Selesai',
    lokasi: 'J5em',
    gambar: '/assets/lantai.jpg',
    tanggal: '02/01/2022'
  },
];

const Riwayat = () => {
  const [filter, setFilter] = useState('Semua');

  const filteredLaporan = laporanDummy.filter(l => {
    if (filter === 'Semua') return true;
    return l.status === filter;
  });

  return (
    <>
      <Navbar />
      <div className="riwayat-container">
        <div className="riwayat-sidebar">
          <ul>
            <li onClick={() => setFilter('Menunggu')}><FiClock /> Menunggu</li>
            <li onClick={() => setFilter('Proses')}><FiSettings /> Diproses</li>
            <li onClick={() => setFilter('Selesai')}><FiCheckCircle /> Selesai</li>
          </ul>
        </div>
        <div className="riwayat-content">
          {filteredLaporan.map(l => (
            <div className="riwayat-card" key={l.id}>
              <img src={l.gambar} alt={l.kategori} />
              <div className="card-info">
                <h3>{l.kategori}</h3>
                <p>Status : <strong>{l.status}</strong></p>
                <p>📍 {l.lokasi}</p>
                <button className="btn-detail">Detail Aduan</button>
                <span className="tanggal">{l.tanggal}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Riwayat;
