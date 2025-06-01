// AdminVerifikasi.jsx
import React, { useEffect, useState, useCallback } from "react";
import AdminLayout from "./AdminLayout";
import { FiUsers, FiTag, FiMapPin, FiCalendar, FiMessageSquare, FiPaperclip, FiCheckCircle, FiXCircle, FiEdit3, FiFilter, FiChevronDown, FiChevronUp, FiImage, FiX } from 'react-icons/fi';
import './AdminVerifikasi.css'; // Pastikan CSS ini diperbarui

// Komponen untuk satu item pengaduan
const PengaduanItemModern = ({ verifikasiItem, onVerifikasi, isDetailView, onToggleDetail }) => {
  const [catatan, setCatatan] = useState(verifikasiItem.catatan_admin || "");
  const [showCatatanInput, setShowCatatanInput] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false); // Untuk expand/collapse deskripsi

  const pengaduan = verifikasiItem.pengaduan_detail;

  const handleAksiVerifikasi = (newStatus) => {
    let catatanUntukDikirim = catatan;
    if (newStatus === 'Ditolak' && !catatan.trim()) {
      const alasan = prompt("Mohon masukkan alasan penolakan (wajib):");
      if (alasan === null || !alasan.trim()) {
        alert("Penolakan dibatalkan. Alasan diperlukan.");
        return;
      }
      catatanUntukDikirim = alasan;
      setCatatan(alasan);
    }
    onVerifikasi(verifikasiItem.id, newStatus, catatanUntukDikirim);
    setShowCatatanInput(false);
  };

  if (!pengaduan) {
    return <div className="av-card-modern error"><p>Data pengaduan tidak lengkap.</p></div>;
  }

  // Tampilan Ringkas (List Item)
  if (!isDetailView) {
    return (
      <div className="av-list-item-modern" onClick={() => onToggleDetail(verifikasiItem.id)}>
        <div className="av-list-item-main">
          {pengaduan.gambar && (
            <div className="av-list-item-thumbnail">
              <img src={pengaduan.gambar} alt="Thumbnail" />
            </div>
          )}
          <div className="av-list-item-info">
            <h4 className="av-list-item-title">{pengaduan.judul || `Laporan ${pengaduan.kategori_display || 'Umum'}`}</h4>
            <p className="av-list-item-meta">
              <FiUsers size={13} /> {pengaduan.username_pelapor || "N/A"}
              <span className="av-meta-separator">|</span>
              <FiTag size={13} /> {pengaduan.kategori_display || "N/A"}
            </p>
            <p className="av-list-item-date">
              <FiCalendar size={13} /> {pengaduan.tanggal_kejadian ? new Date(pengaduan.tanggal_kejadian).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : "N/A"}
            </p>
          </div>
        </div>
        <div className="av-list-item-status-actions">
          <span className={`av-status-chip av-status-${verifikasiItem.status_verifikasi?.replace(/\s+/g, '-').toLowerCase()}`}>
            {verifikasiItem.status_verifikasi}
          </span>
          <button className="av-button-icon av-button-detail-toggle">
            <FiChevronDown size={18} />
          </button>
        </div>
      </div>
    );
  }

  // Tampilan Detail (Expanded Card)
  return (
    <div className="av-card-modern detail-view">
      <div className="av-detail-header-modern">
        <h3 className="av-detail-title">{pengaduan.judul || `Laporan ${pengaduan.kategori_display || 'Umum'}`}</h3>
        <button onClick={() => onToggleDetail(null)} className="av-button-icon av-button-close">
          <FiX size={20} />
        </button>
      </div>

      <div className="av-detail-grid">
        <div className="av-detail-section">
          <strong className="av-detail-section-title">Informasi Pengaduan</strong>
          <p><FiUsers /> <strong>Pelapor:</strong> {pengaduan.username_pelapor || "N/A"}</p>
          <p><FiTag /> <strong>Kategori:</strong> {pengaduan.kategori_display || "N/A"}</p>
          <p><FiMapPin /> <strong>Lokasi:</strong> {pengaduan.lokasi || "N/A"}</p>
          <p><FiCalendar /> <strong>Tgl. Kejadian:</strong> {pengaduan.tanggal_kejadian ? new Date(pengaduan.tanggal_kejadian).toLocaleDateString('id-ID') : "N/A"}</p>
        </div>
        <div className="av-detail-section">
          <strong className="av-detail-section-title">Status</strong>
          <p><strong>Pengaduan:</strong> <span className={`av-status-chip av-status-main-${pengaduan.status?.toLowerCase()}`}>{pengaduan.status || "N/A"}</span></p>
          <p><strong>Verifikasi:</strong> <span className={`av-status-chip av-status-${verifikasiItem.status_verifikasi?.replace(/\s+/g, '-').toLowerCase()}`}>{verifikasiItem.status_verifikasi || "N/A"}</span></p>
          {verifikasiItem.admin_yang_memverifikasi_detail && (
            <p><strong>Diverifikasi oleh:</strong> {verifikasiItem.admin_yang_memverifikasi_detail.username}</p>
          )}
          <p><strong>Waktu Verifikasi:</strong> {verifikasiItem.waktu_verifikasi ? new Date(verifikasiItem.waktu_verifikasi).toLocaleString('id-ID') : "N/A"}</p>
        </div>
      </div>

      {pengaduan.gambar && (
        <div className="av-detail-section">
          <strong className="av-detail-section-title"><FiImage /> Gambar Lampiran</strong>
          <div className="av-detail-image-container">
            <img src={pengaduan.gambar} alt={`Gambar untuk ${pengaduan.judul}`} className="av-detail-image" />
          </div>
        </div>
      )}
      
      <div className="av-detail-section">
        <strong className="av-detail-section-title"><FiMessageSquare /> Deskripsi Pengaduan</strong>
        <div className={`av-detail-deskripsi ${isExpanded ? 'expanded' : ''}`}>
          <p>{pengaduan.deskripsi || "Tidak ada deskripsi."}</p>
        </div>
        {pengaduan.deskripsi && pengaduan.deskripsi.length > 150 && ( // Tampilkan jika teks panjang
             <button onClick={() => setIsExpanded(!isExpanded)} className="av-button-link">
                {isExpanded ? 'Tampilkan lebih sedikit' : 'Tampilkan selengkapnya'} {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
             </button>
        )}
      </div>

      {(verifikasiItem.catatan_admin && !showCatatanInput) && (
        <div className="av-detail-section">
          <strong className="av-detail-section-title">Catatan Admin</strong>
          <p className="av-catatan-admin-display">{verifikasiItem.catatan_admin}</p>
        </div>
      )}

      {/* Aksi Verifikasi atau Edit Catatan */}
      <div className="av-detail-actions-section">
        {verifikasiItem.status_verifikasi === 'Belum Diverifikasi' && (
          <>
            <div className="av-catatan-input-area">
              <label htmlFor={`catatan-${verifikasiItem.id}`}>Catatan Tambahan/Alasan Penolakan:</label>
              <textarea
                id={`catatan-${verifikasiItem.id}`}
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                rows="3"
                placeholder="Catatan untuk penerimaan (opsional), alasan untuk penolakan (wajib)"
              />
            </div>
            <div className="av-action-buttons">
              <button className="av-button primary" onClick={() => handleAksiVerifikasi('Diterima')}>
                <FiCheckCircle /> Terima
              </button>
              <button className="av-button danger" onClick={() => handleAksiVerifikasi('Ditolak')}>
                <FiXCircle /> Tolak
              </button>
            </div>
          </>
        )}
        {verifikasiItem.status_verifikasi !== 'Belum Diverifikasi' && (
          showCatatanInput ? (
            <>
              <div className="av-catatan-input-area">
                <label htmlFor={`catatan-edit-${verifikasiItem.id}`}>Edit Catatan:</label>
                <textarea
                  id={`catatan-edit-${verifikasiItem.id}`}
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  rows="3"
                />
              </div>
              <div className="av-action-buttons">
                <button className="av-button success" onClick={() => {
                  onVerifikasi(verifikasiItem.id, verifikasiItem.status_verifikasi, catatan);
                  setShowCatatanInput(false);
                }}>
                  Simpan Catatan
                </button>
                <button className="av-button secondary" onClick={() => {
                  setCatatan(verifikasiItem.catatan_admin || "");
                  setShowCatatanInput(false);
                }}>
                  Batal
                </button>
              </div>
            </>
          ) : (
            <button className="av-button outline" onClick={() => setShowCatatanInput(true)}>
              <FiEdit3 /> Edit Catatan
            </button>
          )
        )}
      </div>
    </div>
  );
};

// Komponen Utama AdminVerifikasi
const AdminVerifikasi = () => {
  const [daftarVerifikasi, setDaftarVerifikasi] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [detailViewId, setDetailViewId] = useState(null);

  const fetchData = useCallback(() => {
    setIsLoading(true);
    // Jika backend mendukung filter via query param:
    // const apiUrl = `http://127.0.0.1:8000/api/admin/admin-verifikasi/${filterStatus !== "Semua" ? `?status_verifikasi=${encodeURIComponent(filterStatus)}` : ''}`;
    const apiUrl = "http://127.0.0.1:8000/api/admin/admin-verifikasi/"; // Filter di frontend untuk contoh ini
    
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        setDaftarVerifikasi(data.results || data); // Sesuaikan jika API Anda menggunakan paginasi
        setError(null);
      })
      .catch((err) => {
        console.error("Gagal mengambil data verifikasi:", err);
        setError(`Gagal memuat data: ${err.message}.`);
      })
      .finally(() => setIsLoading(false));
  }, []); // Hapus filterStatus dari dependensi jika filter dilakukan di frontend

  useEffect(() => {
    fetchData();
  }, [fetchData]); // Re-fetch jika filterStatus berubah (jika filter di backend)

  const handleVerifikasi = useCallback((idVerifikasi, newStatusVerifikasi, catatanAdmin) => {
    setIsLoading(true); // Tampilkan loading saat proses update
    fetch(`http://127.0.0.1:8000/api/admin/admin-verifikasi/${idVerifikasi}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status_verifikasi: newStatusVerifikasi,
        catatan_admin: catatanAdmin,
      }),
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ detail: `Gagal. Status: ${response.status}` }));
          throw new Error(errorData.detail || `Gagal memperbarui.`);
        }
        return response.json();
      })
      .then((updatedItem) => {
        alert(`Pengaduan berhasil di-${newStatusVerifikasi.toLowerCase()}.`);
        setDaftarVerifikasi((prevList) =>
          prevList.map((item) => (item.id === idVerifikasi ? { ...item, ...updatedItem } : item))
        );
        // Jika ingin menutup detail setelah aksi:
        // if (detailViewId === idVerifikasi) {
        //   setDetailViewId(null);
        // }
      })
      .catch((err) => {
        console.error("Kesalahan saat memperbarui:", err);
        alert(err.message);
      })
      .finally(() => setIsLoading(false));
  }, [detailViewId]); // Tambahkan detailViewId jika logikanya bergantung padanya

  const handleToggleDetail = (id) => {
    setDetailViewId(prevId => (prevId === id ? null : id));
  };

  const listToDisplay = daftarVerifikasi.filter(item => {
    if (filterStatus === "Semua") return true;
    return item.status_verifikasi === filterStatus;
  });

  const itemInDetailView = detailViewId ? listToDisplay.find(item => item.id === detailViewId) : null;

  if (isLoading && daftarVerifikasi.length === 0) { // Tampilkan loader halaman penuh hanya jika data awal belum ada
    return (
      <AdminLayout pageTitle="Verifikasi Pengaduan">
        <div className="av-page-loader"><div className="av-loader"></div><span>Memuat Data...</span></div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout pageTitle="Verifikasi Pengaduan">
        <p className="av-error-message">{error}</p>
        <button onClick={fetchData} className="av-button primary">Coba Lagi</button>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout pageTitle="Verifikasi Pengaduan">
      <div className="av-controls-modern">
        <div className="av-filter-group">
          <FiFilter />
          <select 
              id="filter-status" 
              value={filterStatus} 
              onChange={(e) => { setFilterStatus(e.target.value); setDetailViewId(null); }} // Reset detail view saat filter berubah
              className="av-filter-select-modern"
          >
            <option value="Semua">Semua Status</option>
            <option value="Belum Diverifikasi">Belum Diverifikasi</option>
            <option value="Diterima">Diterima</option>
            <option value="Ditolak">Ditolak</option>
          </select>
        </div>
        {isLoading && <div className="av-inline-loader">Memproses...</div>}
      </div>

      {itemInDetailView ? (
        <PengaduanItemModern 
            key={itemInDetailView.id} 
            verifikasiItem={itemInDetailView} 
            onVerifikasi={handleVerifikasi}
            isDetailView={true}
            onToggleDetail={handleToggleDetail}
        />
      ) : (
        listToDisplay.length > 0 ? (
          <div className="av-list-container-modern">
            {listToDisplay.map((verifikasiItem) => (
              <PengaduanItemModern 
                key={verifikasiItem.id} 
                verifikasiItem={verifikasiItem} 
                onVerifikasi={handleVerifikasi}
                isDetailView={false} // Selalu false karena bukan itemInDetailView
                onToggleDetail={handleToggleDetail}
              />
            ))}
          </div>
        ) : (
          <p className="av-empty-state">Tidak ada pengaduan dengan status "{filterStatus}" saat ini.</p>
        )
      )}
    </AdminLayout>
  );
};

export default AdminVerifikasi;
