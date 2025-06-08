import React, { useEffect, useState, useMemo } from 'react';
import './Riwayat.css'; // Pastikan CSS-nya ada
import Navbar from '../components/Navbar';
import { 
    FiClock, FiSettings, FiCheckCircle, FiList, FiX, 
    FiTag, FiMapPin, FiCalendar, FiMessageSquare, FiArrowLeft 
} from 'react-icons/fi';

// Komponen untuk menampilkan SATU item riwayat dalam bentuk kartu di daftar
const RiwayatCard = ({ item, onDetailClick }) => {
    const pengaduan = item.pengaduan;
    if (!pengaduan) return null;

    return (
        // Menambahkan onClick di sini agar seluruh kartu bisa diklik
        <div className="riwayat-card" onClick={() => onDetailClick(item)}>
            <img src={pengaduan.gambar} alt={pengaduan.kategori_display} />
            <div className="card-info">
                <h3>{pengaduan.judul || `Laporan ${pengaduan.kategori_display}`}</h3>
                <p>Status : <strong className={`status-${item.status.toLowerCase()}`}>{item.status}</strong></p>
                <p>📍 {pengaduan.lokasi}</p>
                {/* Tombol ini sekarang hanya sebagai hiasan, karena seluruh kartu bisa diklik */}
                <button className="btn-detail">Lihat Detail</button>
                <span className="tanggal">{new Date(item.waktu_perubahan).toLocaleDateString('id-ID')}</span>
            </div>
        </div>
    );
};

// ========================================================================
// === GANTI KOMPONEN RiwayatDetail DENGAN VERSI BARU INI ===
// ========================================================================
const RiwayatDetail = ({ item, onClose }) => {
    const pengaduan = item.pengaduan;

    return (
        <div className="riwayat-detail-view">
            <div className="detail-header">
                <button onClick={onClose} className="btn-back">
                    <FiArrowLeft size={24} /> Kembali ke Daftar
                </button>
            </div>

            {/* --- STRUKTUR BARU DIMULAI DARI SINI --- */}
            <div className="detail-body">
                {/* Kolom Kiri untuk Gambar */}
                <div className="detail-image-container">
                    <img src={pengaduan.gambar} alt="Gambar Detail Aduan" className="detail-image" />
                </div>

                {/* Kolom Kanan untuk Info */}
                <div className="detail-info-container">
                    <h3>{pengaduan.judul || `Laporan ${pengaduan.kategori_display}`}</h3>
                    
                    <div className="detail-section">
                        <p><FiTag /> <strong>Kategori:</strong> {pengaduan.kategori_display}</p>
                        <p><FiMapPin /> <strong>Lokasi:</strong> {pengaduan.lokasi}</p>
                        <p><FiCalendar /> <strong>Tgl. Kejadian:</strong> {new Date(pengaduan.tanggal_kejadian).toLocaleDateString('id-ID')}</p>
                    </div>

                    <div className="detail-section">
                        {/* Status Chip sekarang memiliki class dinamis untuk pewarnaan */}
                        <p><strong>Status Laporan:</strong> <span className={`status-chip status-${item.status.toLowerCase().replace(/\s+/g, '-')}`}>{item.status}</span></p>
                        <p><strong>Terakhir Diperbarui:</strong> {new Date(item.waktu_perubahan).toLocaleString('id-ID')}</p>
                    </div>
                    
                    <div className="detail-section">
                        <strong><FiMessageSquare /> Deskripsi Lengkap:</strong>
                        <p className="deskripsi">{pengaduan.deskripsi || "Tidak ada deskripsi."}</p>
                    </div>
                </div>
            </div>
            {/* --- STRUKTUR BARU SELESAI --- */}
        </div>
    );
};


// Komponen Utama Halaman Riwayat
const Riwayat = () => {
    const [riwayatPribadi, setRiwayatPribadi] = useState([]);
    const [filter, setFilter] = useState('Semua');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // --- STATE BARU: Untuk menyimpan item yang sedang dilihat detailnya ---
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        const userId = localStorage.getItem('user_id');
        if (!userId) {
            setError("Tidak bisa menemukan user ID. Silakan login kembali.");
            setLoading(false);
            return;
        }

        const fetchSemuaRiwayat = async () => {
            // ... (logika fetch tetap sama seperti sebelumnya) ...
            setLoading(true);
            setError(null);
            try {
                const res = await fetch('http://127.0.0.1:8000/api/riwayat-pengaduan/');
                if (!res.ok) throw new Error(`Gagal memuat data. Status: ${res.status}`);
                const data = await res.json();
                const semuaRiwayat = data.results || data;
                const riwayatMilikUser = semuaRiwayat.filter(
                    item => item.pengaduan?.pelapor_user_id == userId
                );
                setRiwayatPribadi(riwayatMilikUser);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSemuaRiwayat();
    }, []);

    const filteredRiwayat = useMemo(() => {
        if (filter === 'Semua') return riwayatPribadi;
        return riwayatPribadi.filter(item => item.status === filter);
    }, [riwayatPribadi, filter]);

    // --- FUNGSI BARU: Untuk menampilkan konten yang sesuai (list atau detail) ---
    const renderContent = () => {
        if (loading) return <p>Memuat riwayat...</p>;
        if (error) return <p>Terjadi kesalahan: {error}</p>;

        // Jika ada item yang dipilih, tampilkan komponen RiwayatDetail
        if (selectedItem) {
            return <RiwayatDetail item={selectedItem} onClose={() => setSelectedItem(null)} />;
        }
        
        // Jika tidak, tampilkan daftar seperti biasa
        if (filteredRiwayat.length === 0) {
            return <p>Tidak ada riwayat dengan status "{filter}".</p>;
        }
        return filteredRiwayat.map(item => (
            // Kirim fungsi untuk mengatur item terpilih ke setiap kartu
            <RiwayatCard key={item.id} item={item} onDetailClick={setSelectedItem} />
        ));
    };

    return (
        <>
            <Navbar />
            <div className="riwayat-container">
                {/* --- LOGIKA BARU: Sembunyikan sidebar jika sedang melihat detail --- */}
                {!selectedItem && (
                    <div className="riwayat-sidebar">
                        <ul>
                            <li className={filter === 'Semua' ? 'active' : ''} onClick={() => setFilter('Semua')}><FiList /> Semua</li>
                            <li className={filter === 'Menunggu' ? 'active' : ''} onClick={() => setFilter('Menunggu')}><FiClock /> Menunggu</li>
                            <li className={filter === 'Diproses' ? 'active' : ''} onClick={() => setFilter('Diproses')}><FiSettings /> Diproses</li>
                            <li className={filter === 'Selesai' ? 'active' : ''} onClick={() => setFilter('Selesai')}><FiCheckCircle /> Selesai</li>
                        </ul>
                    </div>
                )}
                <div className="riwayat-content">
                    {renderContent()}
                </div>
            </div>
        </>
    );
};

export default Riwayat;