import React, { useEffect, useState } from 'react';
import './Riwayat.css';
import Navbar from '../components/Navbar';
import { FiClock, FiSettings, FiCheckCircle } from 'react-icons/fi';

const Riwayat = () => {
  const [filter, setFilter] = useState('Semua');
  const [riwayatData, setRiwayatData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data riwayat dan detail pengaduan
  useEffect(() => {
    const fetchRiwayat = async () => {
      try {
        // Step 1: Ambil riwayat
        const res = await fetch('http://127.0.0.1:8000/api/riwayat-pengaduan/riwayat-pengaduan/');
        const riwayat = await res.json();

        // Step 2: Ambil data pengaduan buat join
        const resPengaduan = await fetch('http://127.0.0.1:8000/api/pengaduan/pengaduan/');
        const pengaduan = await resPengaduan.json();

        // Step 3: Gabungkan data
        const fullData = riwayat.map(r => {
          const pengaduanItem = pengaduan.find(p => p.id === r.pengaduan);
          return {
            id: r.id,
            kategori: pengaduanItem ? pengaduanItem.kategori : 'Tidak diketahui',
            status: r.status,
            lokasi: pengaduanItem ? pengaduanItem.lokasi : 'Tidak diketahui',
            gambar: pengaduanItem ? pengaduanItem.gambar : '/assets/default.jpg',
            tanggal: new Date(r.waktu_perubahan).toLocaleDateString('id-ID')
          };
        });

        setRiwayatData(fullData);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRiwayat();
  }, []);

  const filteredLaporan = riwayatData.filter(l => {
    if (filter === 'Semua') return true;
    if (filter === 'Proses') return l.status === 'Diproses';
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
          {loading ? (
            <p>Memuat data...</p>
          ) : filteredLaporan.length === 0 ? (
            <p>Tidak ada riwayat.</p>
          ) : (
            filteredLaporan.map(l => (
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
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Riwayat;
