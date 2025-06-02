import React, { useEffect, useState, useCallback } from 'react';
import {
  FiUsers, FiTag, FiMapPin, FiCalendar, FiMessageSquare, FiImage, FiX,
  FiChevronDown, FiChevronUp, FiFilter, FiClock, FiSettings, FiCheckCircle, FiEdit3, FiInfo
} from 'react-icons/fi';
import './PihakKampus.css';

// Komponen untuk satu item pengaduan
const ItemPengaduanKampus = ({ item, onUpdateStatus, isDetailView, onToggleDetail }) => {
  const [isDeskripsiExpanded, setIsDeskripsiExpanded] = useState(false);
  const pengaduanDetail = item.pengaduan_detail;

  if (!pengaduanDetail) {
    return <div className="pk-list-item-modern error"><p>Data detail pengaduan tidak lengkap atau format tidak sesuai.</p></div>;
  }

  const handleStatusUpdate = (newStatus) => {
    onUpdateStatus(item.id, newStatus);
  };

  const getJudulLaporan = () => {
    if (pengaduanDetail.judul && pengaduanDetail.judul !== "Judul Tidak Tersedia") return pengaduanDetail.judul;
    if (pengaduanDetail.deskripsi) {
      return pengaduanDetail.deskripsi.length > 50 ? pengaduanDetail.deskripsi.substring(0, 50) + '...' : pengaduanDetail.deskripsi;
    }
    return `Laporan ${pengaduanDetail.kategori_display || pengaduanDetail.kategori || 'Umum'}`;
  };

  const pelaporName = pengaduanDetail.pelapor_detail?.username || pengaduanDetail.username_pelapor || "N/A";
  const kategoriName = pengaduanDetail.kategori_display || pengaduanDetail.kategori || "N/A";

  if (!isDetailView) {
    return (
      <div className="pk-list-item-modern" onClick={() => onToggleDetail(item.id)}>
        <div className="pk-list-item-main">
          {pengaduanDetail.gambar && (
            <div className="pk-list-item-thumbnail">
              <img src={pengaduanDetail.gambar.startsWith('http') ? pengaduanDetail.gambar : `http://127.0.0.1:8000${pengaduanDetail.gambar}`} alt="Thumbnail Pengaduan" />
            </div>
          )}
          <div className="pk-list-item-info">
            <h4 className="pk-list-item-title">{getJudulLaporan()}</h4>
            <p className="pk-list-item-meta">
              <FiUsers /> {pelaporName}
              <span className="pk-meta-separator">|</span>
              <FiTag /> {kategoriName}
            </p>
            <p className="pk-list-item-date">
              <FiCalendar /> Kejadian: {pengaduanDetail.tanggal_kejadian ? new Date(pengaduanDetail.tanggal_kejadian).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : "N/A"}
            </p>
          </div>
        </div>
        <div className="pk-list-item-status-actions">
          <span className={`pk-status-chip pk-status-${item.status_kampus?.toLowerCase().replace(/\s+/g, '-')}`}>
            {item.status_kampus}
          </span>
          <button className="pk-button-icon pk-button-detail-toggle" aria-label="Lihat detail">
            <FiChevronDown size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pk-card-modern detail-view">
      <div className="pk-detail-header-modern">
        <h3 className="pk-detail-title">{getJudulLaporan()}</h3>
        <button onClick={() => onToggleDetail(null)} className="pk-button-icon pk-button-close" aria-label="Tutup detail">
          <FiX size={20} />
        </button>
      </div>
      <div className="pk-detail-grid">
        <div className="pk-detail-section">
          <strong className="pk-detail-section-title"><FiInfo /> Informasi Pengaduan</strong>
          <p><FiUsers /> <strong>Pelapor:</strong> {pelaporName}</p>
          <p><FiTag /> <strong>Kategori:</strong> {kategoriName}</p>
          <p><FiMapPin /> <strong>Lokasi:</strong> {pengaduanDetail.lokasi || "N/A"}</p>
          {pengaduanDetail.tanggal_kejadian &&
            <p><FiCalendar /> <strong>Tgl. Kejadian:</strong> {new Date(pengaduanDetail.tanggal_kejadian).toLocaleDateString('id-ID', { dateStyle: 'long' })}</p>
          }
        </div>
        <div className="pk-detail-section">
          <strong className="pk-detail-section-title"><FiSettings /> Status & Penanganan</strong>
          <p><strong>Status Kampus:</strong>&nbsp;
            <span className={`pk-status-chip pk-status-${item.status_kampus?.toLowerCase().replace(/\s+/g, '-')}`}>
              {item.status_kampus}
            </span>
          </p>
        </div>
      </div>
      {pengaduanDetail.gambar && (
        <div className="pk-detail-section">
          <strong className="pk-detail-section-title"><FiImage /> Gambar Lampiran</strong>
          <div className="pk-detail-image-container">
            <a href={pengaduanDetail.gambar.startsWith('http') ? pengaduanDetail.gambar : `http://127.0.0.1:8000${pengaduanDetail.gambar}`} target="_blank" rel="noopener noreferrer">
              <img src={pengaduanDetail.gambar.startsWith('http') ? pengaduanDetail.gambar : `http://127.0.0.1:8000${pengaduanDetail.gambar}`} alt={`Gambar untuk ${getJudulLaporan()}`} className="pk-detail-image" />
            </a>
          </div>
        </div>
      )}
      <div className="pk-detail-section">
        <strong className="pk-detail-section-title"><FiMessageSquare /> Deskripsi Pengaduan</strong>
        <div className={`pk-detail-deskripsi ${isDeskripsiExpanded ? 'expanded' : ''}`}>
          <p>{pengaduanDetail.deskripsi || "Tidak ada deskripsi."}</p>
        </div>
        {pengaduanDetail.deskripsi && pengaduanDetail.deskripsi.length > 100 && (
          <button onClick={() => setIsDeskripsiExpanded(!isDeskripsiExpanded)} className="pk-button-link">
            {isDeskripsiExpanded ? 'Lebih sedikit' : 'Selengkapnya'} {isDeskripsiExpanded ? <FiChevronUp /> : <FiChevronDown />}
          </button>
        )}
      </div>
      <div className="pk-detail-actions-section pk-detail-section" style={{ backgroundColor: '#fff' }}>
        <strong className="pk-detail-section-title"><FiEdit3 /> Aksi Pihak Kampus</strong>
        <div className="pk-action-buttons" style={{ marginTop: '10px' }}>
          <p style={{ fontSize: '0.9em', color: '#555', width: '100%', marginBottom: '5px' }}>Ubah Status Pengaduan:</p>
          {item.status_kampus === 'Menunggu' && (
            <button className="pk-button warning" onClick={() => handleStatusUpdate('Diproses')}>
              <FiSettings /> Tandai Diproses
            </button>
          )}
          {(item.status_kampus === 'Menunggu' || item.status_kampus === 'Diproses') && (
            <button className="pk-button success" onClick={() => handleStatusUpdate('Selesai')}>
              <FiCheckCircle /> Tandai Selesai
            </button>
          )}
          {item.status_kampus === 'Diproses' && (
             <button className="pk-button secondary" onClick={() => handleStatusUpdate('Menunggu')}>
              <FiClock /> Kembalikan ke Menunggu
            </button>
          )}
           {item.status_kampus === 'Selesai' && (
            <button className="pk-button warning" onClick={() => handleStatusUpdate('Diproses')}>
              <FiSettings /> Buka Kembali (Jadi Diproses)
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const PengaduanKampus = () => {
  const [daftarPengaduan, setDaftarPengaduan] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [filterKategori, setFilterKategori] = useState("Semua"); // State untuk filter kategori
  const [detailViewId, setDetailViewId] = useState(null);

  // Daftar kategori - idealnya ini sinkron dengan KATEGORI_CHOICES di model Django
  const KATEGORI_CHOICES = [
    "Semua", "Jalan rusak", "Lantai rusak", "Fasilitas umum", "Sampah", "Lainnya"
  ];

  const API_URL_BASE = 'http://127.0.0.1:8000/api/pihak-kampus/pihak-kampus-pengaduan/';

  const fetchData = useCallback(() => {
    setIsLoading(true);
    setError(null);
    let params = new URLSearchParams();

    if (filterStatus !== "Semua") {
      params.append('status_kampus', filterStatus);
    }
    if (filterKategori !== "Semua") {
      params.append('kategori', filterKategori); // Tambahkan filter kategori ke params
    }

    const queryString = params.toString();
    const url = `${API_URL_BASE}${queryString ? `?${queryString}` : ''}`;
    console.log("Fetching data from:", url); // Untuk debug URL

    fetch(url)
      .then((response) => {
        if (!response.ok) {
            return response.text().then(text => {
                let errorMsg = `Gagal memuat data: Server merespons dengan status ${response.status} ${response.statusText}`;
                try {
                    const errJson = JSON.parse(text);
                    errorMsg = errJson.detail || errJson.message || errorMsg;
                } catch (e) {
                    if(text) errorMsg += ` - Respon server: ${text.substring(0,150)}`;
                }
                throw new Error(errorMsg);
            });
        }
        return response.json();
      })
      .then((data) => {
        setDaftarPengaduan(Array.isArray(data) ? data : data.results || []);
      })
      .catch((err) => {
        console.error("Gagal mengambil data pengaduan:", err);
        setError(err.message);
        setDaftarPengaduan([]);
      })
      .finally(() => setIsLoading(false));
  }, [filterStatus, filterKategori]); // filterKategori ditambahkan sebagai dependensi

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUpdateStatus = useCallback((idPengaduanKampus, newStatus) => {
    setIsLoading(true);
    fetch(`${API_URL_BASE}${idPengaduanKampus}/update_status/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status_kampus: newStatus }),
    })
    .then(async (response) => {
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `Error server: ${response.status}` }));
        throw new Error(errorData.detail || errorData.message || `Gagal memperbarui status (HTTP ${response.status}).`);
      }
      return response.json();
    })
    .then((responseData) => {
      alert(responseData.message || `Status pengaduan berhasil diubah menjadi ${newStatus}.`);
      fetchData();
    })
    .catch((err) => {
      console.error("Kesalahan saat memperbarui status:", err);
      let displayError = err.message;
      if (err.message && (err.message.toLowerCase().includes("internal server error") || err.message.includes("500"))) {
          displayError = "Terjadi kesalahan internal pada server saat mengubah status. Silakan periksa log server atau hubungi administrator.";
      } else if (err.message && err.message.toLowerCase().includes("failed to fetch")) {
          displayError = "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.";
      }
      alert(displayError);
    })
    .finally(() => setIsLoading(false));
  }, [fetchData]);

  const handleToggleDetail = (id) => {
    setDetailViewId(prevId => (prevId === id ? null : id));
  };

  const listToDisplay = daftarPengaduan.sort((a, b) => {
    const dateA = a.pengaduan_detail?.tanggal_kejadian ? new Date(a.pengaduan_detail.tanggal_kejadian) : null;
    const dateB = b.pengaduan_detail?.tanggal_kejadian ? new Date(b.pengaduan_detail.tanggal_kejadian) : null;
    if (dateB && dateA) return dateB - dateA;
    if (dateB) return 1; // Item dengan tanggal (lebih baru) duluan
    if (dateA) return -1;
    return 0; // Jika keduanya tidak ada tanggal kejadian
  });

  const itemInDetailView = detailViewId ? listToDisplay.find(item => item.id === detailViewId) : null;

  return (
    <div>
      <h2 className="pk-page-title">Manajemen Pengaduan Kampus</h2>
      <div className="pk-controls-modern">
        <div className="pk-filter-group">
          <FiFilter />
          <label htmlFor="filter-status-kampus" className="sr-only">Filter Status</label>
          <select
            id="filter-status-kampus"
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setDetailViewId(null); }}
            className="pk-filter-select-modern"
            aria-label="Filter status pengaduan"
          >
            <option value="Semua">Semua Status</option>
            <option value="Menunggu">Menunggu</option>
            <option value="Diproses">Diproses</option>
            <option value="Selesai">Selesai</option>
          </select>
        </div>

        <div className="pk-filter-group"> {/* Filter Kategori */}
          <FiTag />
          <label htmlFor="filter-kategori-kampus" className="sr-only">Filter Kategori</label>
          <select
            id="filter-kategori-kampus"
            value={filterKategori}
            onChange={(e) => { setFilterKategori(e.target.value); setDetailViewId(null); }}
            className="pk-filter-select-modern"
            aria-label="Filter kategori pengaduan"
          >
            {KATEGORI_CHOICES.map(kategori => (
              <option key={kategori} value={kategori}>{kategori === "Semua" ? "Semua Kategori" : kategori}</option>
            ))}
          </select>
        </div>
        {isLoading && daftarPengaduan.length > 0 && <div className="pk-inline-loader">Memperbarui...</div>}
      </div>

      {error && <p className="pk-error-message">{error}</p>}
      {!isLoading && listToDisplay.length === 0 && !error && (
          <p className="pk-empty-state">Tidak ada pengaduan {filterKategori !== "Semua" ? `dengan kategori "${filterKategori}"` : (filterStatus !== "Semua" ? "" : "yang sesuai")} {filterStatus !== "Semua" ? `dan status "${filterStatus}"` : ''} saat ini.</p>
      )}

      {itemInDetailView ? (
        <ItemPengaduanKampus
          key={itemInDetailView.id}
          item={itemInDetailView}
          onUpdateStatus={handleUpdateStatus}
          isDetailView={true}
          onToggleDetail={handleToggleDetail}
        />
      ) : (
        !isLoading && listToDisplay.length > 0 && (
          <div className="pk-list-container-modern">
            {listToDisplay.map((item) => (
              <ItemPengaduanKampus
                key={item.id}
                item={item}
                onUpdateStatus={handleUpdateStatus}
                isDetailView={false}
                onToggleDetail={handleToggleDetail}
              />
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default PengaduanKampus;