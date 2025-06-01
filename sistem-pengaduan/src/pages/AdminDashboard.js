// AdminDashboard.jsx
import React, { useEffect, useState, useCallback } from 'react';
import AdminLayout from './AdminLayout';
import { Link, useNavigate } from 'react-router-dom'; // Mengimpor useNavigate
import { FiUsers, FiUserCheck, FiFileText, FiAlertOctagon, FiTag, FiLogOut } from 'react-icons/fi'; // Menambahkan FiLogOut
import './AdminDashboard.css';

// Komponen untuk satu item ringkasan verifikasi di dashboard
const VerifikasiRingkasItemModern = ({ item }) => {
  if (!item || !item.pengaduan_detail) return null;
  const pengaduan = item.pengaduan_detail;

  return (
    <Link to={`/admin/verifikasi#item-${item.id}`} className="db-verif-item-modern">
      {pengaduan.gambar && (
        <div className="db-verif-item-image-wrapper">
          <img src={pengaduan.gambar} alt={pengaduan.judul || "Pengaduan"} className="db-verif-item-image" />
        </div>
      )}
      <div className="db-verif-item-content">
        <h5 className="db-verif-item-title">{pengaduan.judul || `Laporan ${pengaduan.kategori_display || 'Umum'}`}</h5>
        <p className="db-verif-item-meta">
          <FiUsers size={13} style={{ marginRight: '5px', verticalAlign: 'middle' }} />
          {pengaduan.username_pelapor || "N/A"}
        </p>
        <p className="db-verif-item-meta">
          <FiTag size={13} style={{ marginRight: '5px', verticalAlign: 'middle' }} />
          {pengaduan.kategori_display || "N/A"}
        </p>
      </div>
      <span className={`db-verif-item-status db-verif-status-${item.status_verifikasi?.replace(/\s+/g, '-').toLowerCase()}`}>
        {item.status_verifikasi}
      </span>
    </Link>
  );
};


const AdminDashboard = () => {
  const [pengaduanBelumDiverifikasi, setPengaduanBelumDiverifikasi] = useState([]);
  const [userStats, setUserStats] = useState({ warga: 0, pihak: 0 });
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isLoadingVerifikasi, setIsLoadingVerifikasi] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate(); // Hook untuk navigasi programatik

  const fetchDashboardData = useCallback(() => {
    setIsLoadingStats(true);
    setIsLoadingVerifikasi(true);
    setError(null); // Reset error setiap kali fetch

    // 1. Fetch data statistik user (warga & pihak)
    const userStatsPromise = fetch("http://127.0.0.1:8000/api/admin/admin-stats/", {
      method: "GET",
      // credentials: "include", // Hanya jika Anda menggunakan session/cookies dan CORS diatur dengan benar
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then(errData => { // Coba baca body error jika ada
            throw new Error(`Gagal ambil data akun: ${res.status} - ${errData.detail || res.statusText}`);
          }).catch(() => { // Jika body error tidak bisa di-parse
            throw new Error(`Gagal ambil data akun: ${res.status} - ${res.statusText}`);
          });
        }
        return res.json();
      })
      .then((data) => {
        setUserStats({
          warga: data.warga_kampus_count !== undefined ? data.warga_kampus_count : (data.warga || 0), // Sesuaikan dengan field dari API Anda
          pihak: data.pihak_kampus_count !== undefined ? data.pihak_kampus_count : (data.pihak || 0), // Sesuaikan dengan field dari API Anda
        });
        return null; // Mengembalikan null agar tidak dianggap error oleh Promise.all jika berhasil
      })
      .catch((err) => {
        console.error("Error saat fetch statistik akun:", err);
        return err; // Mengembalikan objek error
      })
      .finally(() => setIsLoadingStats(false));

    // 2. Fetch pengaduan yang belum diverifikasi
    const verifikasiPromise = fetch("http://127.0.0.1:8000/api/admin/admin-verifikasi/?status_verifikasi=Belum Diverifikasi&limit=4", {
        method: "GET",
        // credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then(errData => {
            throw new Error(`Gagal ambil laporan perlu verifikasi: ${res.status} - ${errData.detail || res.statusText}`);
          }).catch(() => {
            throw new Error(`Gagal ambil laporan perlu verifikasi: ${res.status} - ${res.statusText}`);
          });
        }
        return res.json();
      })
      .then((data) => {
        setPengaduanBelumDiverifikasi(data.results || data); // Sesuaikan jika API Anda paginasi
        return null;
      })
      .catch((err) => {
        console.error("Error saat fetch laporan perlu verifikasi:", err);
        return err;
      })
      .finally(() => setIsLoadingVerifikasi(false));

    // Menangani semua promise
    Promise.all([userStatsPromise, verifikasiPromise])
      .then(results => {
        // Cek apakah ada error dari salah satu promise
        const errors = results.filter(result => result instanceof Error);
        if (errors.length > 0) {
          // Gabungkan pesan error atau ambil yang pertama
          const combinedErrorMessage = errors.map(e => e.message).join('; ');
          setError(combinedErrorMessage);
          // Kosongkan data jika ada error agar tidak menampilkan data lama/salah
          setUserStats({ warga: 0, pihak: 0 });
          setPengaduanBelumDiverifikasi([]);
        } else {
          setError(null); // Tidak ada error dari kedua fetch
        }
      });

  }, []); // useCallback dependency array kosong

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Fungsi untuk menangani logout
  const handleLogout = () => {
    // Hapus data dari localStorage (sesuai dengan yang disimpan di komponen Login Anda)
    localStorage.removeItem('user_id');
    localStorage.removeItem('username');
    // localStorage.removeItem('wargaKampus_nama'); // Jika ini juga disimpan untuk admin
    
    // Hapus data dari sessionStorage (sesuai dengan yang disimpan di komponen Login Anda)
    sessionStorage.removeItem('is_staff');

    // Opsional: Panggil API backend untuk logout jika ada (untuk menginvalidasi token di server)
    // Contoh:
    fetch('http://127.0.0.1:8000/api/logout/', { 
      method: 'POST',
      headers: {
        // 'Authorization': `Bearer ${token}` // Jika menggunakan token Bearer
        'Content-Type': 'application/json'
      },
      // body: JSON.stringify({ refresh_token: '...' }) // Jika API memerlukan refresh token
    })
    .then(response => {
      if (response.ok) {
        console.log('Logout berhasil di server');
      } else {
        console.error('Gagal logout di server');
      }
    })
    .catch(error => console.error('Error saat logout di server:', error))
    .finally(() => {
      // Redirect ke halaman login setelah semua proses selesai, baik berhasil maupun gagal logout server
      navigate('/');
    });

    // Jika tidak ada API logout backend atau ingin redirect segera:
    // console.log('Logout berhasil, mengarahkan ke halaman login...');
    // navigate('/login'); 
    // Alternatif lain: window.location.href = '/login'; (menyebabkan full page reload)
  };

  const isLoading = isLoadingStats || isLoadingVerifikasi;

  return (
    <AdminLayout pageTitle="Dashboard">
      <div className="admin-dashboard-modern">
        {/* Tombol Logout */}
        <div style={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            paddingBottom: '15px', 
            borderBottom: '1px solid #eee', // Garis pemisah opsional agar terlihat rapi
            marginBottom: '20px' // Memberi jarak ke elemen di bawahnya
        }}>
          <button 
            onClick={handleLogout} 
            className="av-button danger" // Anda mungkin perlu mendefinisikan style untuk .av-button.danger di CSS Anda
            style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '8px 15px', 
                fontSize: '14px',
                cursor: 'pointer' // Menambahkan cursor pointer untuk indikasi tombol
            }}
          >
            <FiLogOut style={{ marginRight: '8px' }} />
            Logout
          </button>
        </div>

        {/* Grid Statistik */}
        <div className="dashboard-stats-grid">
          <div className="stat-card-modern">
            <div className="stat-card-icon warga">
              <FiUsers size={22} />
            </div>
            <div className="stat-card-info">
              <span className="stat-card-title">User Warga Kampus</span>
              <span className="stat-card-value">{isLoadingStats ? '...' : userStats.warga}</span>
            </div>
            {/* <Link to="/admin/users/warga" className="stat-card-link">Lihat</Link> */}
          </div>
          <div className="stat-card-modern">
            <div className="stat-card-icon pihak">
              <FiUserCheck size={22} />
            </div>
            <div className="stat-card-info">
              <span className="stat-card-title">User Pihak Kampus</span>
              <span className="stat-card-value">{isLoadingStats ? '...' : userStats.pihak}</span>
            </div>
            {/* <Link to="/admin/users/pihak" className="stat-card-link">Lihat</Link> */}
          </div>
          <div className="stat-card-modern">
            <div className="stat-card-icon pending">
              <FiAlertOctagon size={22} />
            </div>
            <div className="stat-card-info">
              <span className="stat-card-title">Laporan Pengaduan</span>
              <span className="stat-card-value">{isLoadingVerifikasi ? '...' : pengaduanBelumDiverifikasi.length}</span>
            </div>
            <Link to="/admin/verifikasi" className="stat-card-link">Lihat Semua</Link>
          </div>
        </div>

        {/* Bagian Laporan Perlu Verifikasi */}
        <div className="dashboard-section-modern">
          <div className="dashboard-section-header-modern">
            <h3>Laporan Perlu Verifikasi</h3>
            {pengaduanBelumDiverifikasi.length > 0 && (
                 <Link to="/admin/verifikasi" className="view-all-link-modern">
                   Lihat Semua &rarr;
                 </Link>
            )}
          </div>
          {isLoadingVerifikasi && <div className="av-loader" style={{margin: '20px auto'}}></div>}
          
          {/* Menampilkan error global jika ada */}
          {error && !isLoading && ( // Hanya tampilkan error jika loading selesai
            <p className="av-error-message" style={{textAlign: 'left', padding: '10px'}}>
                Terjadi kesalahan saat memuat data: <br/>
                <small>{error}</small> <br/>
                <button onClick={fetchDashboardData} className="av-button primary small" style={{marginTop: '10px'}}>Coba Lagi</button>
            </p>
          )}

          {!isLoadingVerifikasi && !error && pengaduanBelumDiverifikasi.length === 0 && (
            <p className="db-empty-state">Tidak ada laporan yang perlu diverifikasi saat ini. Kerja bagus!</p>
          )}
          {!isLoadingVerifikasi && !error && pengaduanBelumDiverifikasi.length > 0 && (
            <div className="db-verif-list-modern">
              {pengaduanBelumDiverifikasi.map((item) => (
                <VerifikasiRingkasItemModern key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;