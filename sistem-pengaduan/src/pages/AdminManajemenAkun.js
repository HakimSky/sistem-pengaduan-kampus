// AdminManajemenAkun.jsx
import React, { useEffect, useState, useCallback } from "react";
import AdminLayout from "./AdminLayout";
import {
  FiUsers, FiUserCheck, FiUserX, FiCalendar, FiMail,
  FiTrash2, FiFilter, FiChevronDown, FiChevronUp, FiX,
  FiShield, FiUser
} from 'react-icons/fi';
import './AdminManajemenAkun.css';

// Fungsi penentu role berdasarkan data user
const getRoleDisplayNameBasedOnUsername = (userData) => {
  if (!userData || !userData.username) return "Tidak Diketahui";
  const usernameLower = userData.username.toLowerCase();
  if (usernameLower === "admin" || userData.is_superuser) return "Admin";
  if (usernameLower.startsWith("ums_")) return "Pihak Kampus";
  return "Warga Kampus";
};

// Fungsi helper untuk mengambil CSRF token dari cookie
// PENTING: Jika Anda benar-benar tidak mau menggunakan CSRF, backend Anda harus @csrf_exempt
// untuk view yang menangani PATCH/DELETE. Ini tidak direkomendasikan.
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

const AkunItem = ({ user, onToggleActive, onDeleteUser, isDetailView, onToggleDetail }) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const role = getRoleDisplayNameBasedOnUsername(user);
  const isAdminUser = user.username.toLowerCase() === 'admin' || user.is_superuser;

  const handleToggleActive = () => onToggleActive(user.id, !user.is_active);
  const handleDelete = () => {
    onDeleteUser(user.id);
    setShowConfirmDelete(false);
  };

  if (!isDetailView) {
    return (
      <div className="ama-list-item" onClick={() => onToggleDetail(user.id)}>
        <div className="ama-list-item-main">
          <div className={`ama-list-item-avatar role-${role.toLowerCase().replace(/\s+/g, '-')}`}>
            {role === "Admin" && <FiShield size={20} title="Admin"/>}
            {role === "Pihak Kampus" && <FiUserCheck size={20} title="Pihak Kampus"/>}
            {role === "Warga Kampus" && <FiUser size={20} title="Warga Kampus"/>}
            {role === "Tidak Diketahui" && <FiUser size={20} title="Tidak Diketahui"/>}
          </div>
          <div className="ama-list-item-info">
            <h4 className="ama-list-item-title">
              {user.username}
              {(user.first_name || user.last_name) && ` (${(user.first_name || "")} ${(user.last_name || "")})`.trim()}
            </h4>
            <p className="ama-list-item-meta">
              <FiMail size={13} /> {user.email || "Email tidak tersedia"}
              <span className="ama-meta-separator">|</span>
              <FiUsers size={13} /> {role}
            </p>
            <p className="ama-list-item-date">
              <FiCalendar size={13} /> Bergabung: {user.date_joined ? new Date(user.date_joined).toLocaleDateString('id-ID') : "N/A"}
            </p>
          </div>
        </div>
        <div className="ama-list-item-status-actions">
          <span className={`ama-status-chip ama-status-${user.is_active ? 'aktif' : 'nonaktif'}`}>
            {user.is_active ? 'Aktif' : 'Nonaktif'}
          </span>
          <button className="ama-button-icon ama-button-detail-toggle" aria-label="Lihat Detail"> <FiChevronDown size={18} /> </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ama-card-detail">
      <div className="ama-detail-header">
        <h3 className="ama-detail-title">{user.username}</h3>
        <button onClick={() => onToggleDetail(null)} className="ama-button-icon ama-button-close" aria-label="Tutup Detail"> <FiX size={20} /> </button>
      </div>
      <div className="ama-detail-grid">
        <div className="ama-detail-section">
          <strong className="ama-detail-section-title">Informasi Akun</strong>
          <p><FiUser /> <strong>Username:</strong> {user.username}</p>
          <p><FiMail /> <strong>Email:</strong> {user.email || "N/A"}</p>
          <p><strong>Nama Depan:</strong> {user.first_name || "N/A"}</p>
          <p><strong>Nama Belakang:</strong> {user.last_name || "N/A"}</p>
          <p><FiUsers /> <strong>Role:</strong> {role}</p>
        </div>
        <div className="ama-detail-section">
          <strong className="ama-detail-section-title">Status & Aktivitas</strong>
          <p><strong>Status Akun:</strong> <span className={`ama-status-chip ama-status-${user.is_active ? 'aktif' : 'nonaktif'}`}>{user.is_active ? 'Aktif' : 'Nonaktif'}</span></p>
          <p><FiCalendar /> <strong>Tanggal Bergabung:</strong> {user.date_joined ? new Date(user.date_joined).toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short'}) : "N/A"}</p>
          <p><strong>Login Terakhir:</strong> {user.last_login ? new Date(user.last_login).toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short'}) : "Belum pernah login"}</p>
        </div>
      </div>
      <div className="ama-detail-actions-section">
        <strong className="ama-detail-section-title">Aksi Manajemen</strong>
        {!isAdminUser ? (
          <>
            <div className="ama-action-buttons">
              <button className={`ama-button ${user.is_active ? 'warning' : 'success'}`} onClick={handleToggleActive} title={user.is_active ? "Nonaktifkan akun ini" : "Aktifkan akun ini"}>
                {user.is_active ? <><FiUserX /> Nonaktifkan</> : <><FiUserCheck /> Aktifkan</>}
              </button>
              <button className="ama-button danger" onClick={() => setShowConfirmDelete(true)} title="Hapus akun ini secara permanen"> <FiTrash2 /> Hapus Akun </button>
            </div>
            {showConfirmDelete && (
              <div className="ama-confirm-delete">
                <p><strong>Anda yakin ingin menghapus akun {user.username}?</strong> Tindakan ini tidak dapat diurungkan.</p>
                <button className="ama-button danger" onClick={handleDelete}>Ya, Hapus</button>
                <button className="ama-button secondary" onClick={() => setShowConfirmDelete(false)}>Batal</button>
              </div>
            )}
          </>
        ) : (<p><em>Aksi manajemen tidak tersedia untuk akun Admin.</em></p>)}
      </div>
    </div>
  );
};

const AdminManajemenAkun = () => {
  const [daftarUser, setDaftarUser] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [filterRole, setFilterRole] = useState("Semua");
  const [searchTerm, setSearchTerm] = useState("");
  const [detailViewId, setDetailViewId] = useState(null);

  const API_URL_USERS = "http://127.0.0.1:8000/api/admin/user-management/";

  const fetchData = useCallback((showLoadingIndicator = true) => {
    if (showLoadingIndicator) setIsLoading(true);
    console.log("FETCHDATA: Mencoba mengambil data dari:", API_URL_USERS);

    fetch(API_URL_USERS, {
        credentials: 'include', // SANGAT PENTING untuk mengirim cookies (session auth)
        headers: { 'Content-Type': 'application/json' }
    })
    .then(async response => { // Menggunakan async untuk await response.text() di dalam
        console.log("FETCHDATA: Status respons API:", response.status, response.statusText);
        if (!response.ok) {
            const errorText = await response.text(); // Ambil body error sebagai teks
            let errorDetail = errorText;
            try {
                const jsonError = JSON.parse(errorText);
                errorDetail = jsonError.detail || JSON.stringify(jsonError);
            } catch (e) {
                if (errorText.length > 200) errorDetail = errorText.substring(0, 200) + "...";
            }
            // Pesan error spesifik untuk 401/403
            if (response.status === 401 || response.status === 403) {
                throw new Error(`Autentikasi Sesi Gagal atau Tidak Diizinkan (Status: ${response.status}). Pastikan Anda sudah login sebagai admin dan CORS dikonfigurasi dengan benar untuk kredensial. Detail: ${errorDetail}`);
            }
            throw new Error(`HTTP error! (Status: ${response.status}) - ${errorDetail}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("FETCHDATA: Data mentah diterima:", data);
        const users = Array.isArray(data) ? data : (data.results || []);
        setDaftarUser(users);
        setError(null);
    })
    .catch(err => {
        console.error("FETCHDATA: Error detail:", err);
        setError(`Gagal memuat data: ${err.message}.`);
        setDaftarUser([]);
    })
    .finally(() => {
        if (showLoadingIndicator) setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUserAction = useCallback(async (actionType, userId) => {
    setIsLoading(true);
    let url = `${API_URL_USERS}${userId}/`;
    let method = "";
    let alertMessage = "";
    const csrftoken = getCookie('csrftoken'); // Tetap ambil CSRF token

    // Peringatan jika CSRF tidak ada (sesuai diskusi sebelumnya)
    if (!csrftoken && (actionType === 'toggleActive' || actionType === 'deleteUser')) {
        console.warn("HANDLEUSERACTION: CSRF token tidak ditemukan. Aksi mungkin gagal jika backend memerlukannya.");
    }

    if (actionType === 'toggleActive') {
      url = `${API_URL_USERS}${userId}/toggle-active/`; method = "PATCH"; alertMessage = `Status akun berhasil diubah.`;
    } else if (actionType === 'deleteUser') {
      method = "DELETE"; alertMessage = `Akun berhasil dihapus.`;
    } else {
      console.warn("HANDLEUSERACTION: Tipe aksi tidak dikenal:", actionType); setIsLoading(false); return;
    }

    console.log(`HANDLEUSERACTION: Melakukan ${method} ke ${url}`);
    try {
      const response = await fetch(url, {
        method: method,
        credentials: 'include', // PENTING untuk mengirim cookies
        headers: {
          "Content-Type": "application/json",
          // Jika Anda memutuskan untuk TIDAK menggunakan CSRF, baris ini bisa dikomentari.
          // TAPI, backend Anda HARUS dikonfigurasi untuk tidak memeriksa CSRF untuk endpoint ini,
          // yang memiliki risiko keamanan. Disarankan untuk tetap menyertakannya.
          'X-CSRFToken': csrftoken,
        },
      });

      console.log(`HANDLEUSERACTION: Status respons API (${actionType}):`, response.status, response.statusText);
      if (!response.ok && response.status !== 204) { // 204 untuk DELETE sukses
        const errorText = await response.text();
        let errorDetail = errorText;
        try {
            const jsonError = JSON.parse(errorText);
            errorDetail = jsonError.detail || JSON.stringify(jsonError);
        } catch (e) {
            if (errorText.length > 200) errorDetail = errorText.substring(0, 200) + "...";
        }
        if (response.status === 401 || response.status === 403) {
            throw new Error(`Autentikasi/Otorisasi Gagal untuk aksi (Status: ${response.status}). Detail: ${errorDetail}`);
        }
        throw new Error(`Gagal melakukan aksi ${actionType} (Status: ${response.status}). Detail: ${errorDetail}`);
      }

      alert(alertMessage);

      if (actionType === 'deleteUser') {
        setDaftarUser(prevList => prevList.filter(user => user.id !== userId));
        if (detailViewId === userId) setDetailViewId(null);
      } else if (actionType === 'toggleActive') {
        const updatedUserData = await response.json();
        setDaftarUser(prevList => prevList.map(user => (user.id === userId ? { ...user, ...updatedUserData } : user)));
      } else {
        fetchData(false);
      }
    } catch (err) {
      console.error(`HANDLEUSERACTION: Kesalahan saat ${actionType} untuk user ID ${userId}:`, err);
      alert(err.message || `Terjadi kesalahan saat melakukan aksi ${actionType}.`);
    } finally {
      setIsLoading(false);
    }
  }, [detailViewId, daftarUser, fetchData]);

  const handleToggleDetail = (id) => setDetailViewId(prevId => (prevId === id ? null : id));

  const filteredUsers = daftarUser
    .filter(user => filterStatus === "Semua" || (filterStatus === "Aktif" ? user.is_active : !user.is_active))
    .filter(user => filterRole === "Semua" || getRoleDisplayNameBasedOnUsername(user) === filterRole)
    .filter(user => {
      if (!searchTerm.trim()) return true;
      const lowerSearchTerm = searchTerm.toLowerCase();
      return (
        user.username.toLowerCase().includes(lowerSearchTerm) ||
        (user.email && user.email.toLowerCase().includes(lowerSearchTerm)) ||
        (user.first_name && user.first_name.toLowerCase().includes(lowerSearchTerm)) ||
        (user.last_name && user.last_name.toLowerCase().includes(lowerSearchTerm))
      );
    });

  const itemInDetailView = detailViewId ? filteredUsers.find(user => user.id === detailViewId) : null;

  if (isLoading && daftarUser.length === 0) {
    return <AdminLayout pageTitle="Manajemen Akun Pengguna"><div className="ama-page-loader"><div className="ama-loader"></div><span>Memuat Data Pengguna...</span></div></AdminLayout>;
  }

  return (
    <AdminLayout pageTitle="Manajemen Akun Pengguna">
      <div className="ama-controls">
        <div className="ama-filter-group">
          <FiFilter aria-hidden="true"/>
          <input type="search" placeholder="Cari username, email, nama..." value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setDetailViewId(null); }} className="ama-search-input" aria-label="Cari pengguna"/>
          <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setDetailViewId(null); }} className="ama-filter-select" aria-label="Filter berdasarkan status akun">
            <option value="Semua">Semua Status</option><option value="Aktif">Aktif</option><option value="Nonaktif">Nonaktif</option>
          </select>
          <select value={filterRole} onChange={e => { setFilterRole(e.target.value); setDetailViewId(null); }} className="ama-filter-select" aria-label="Filter berdasarkan role pengguna">
            <option value="Semua">Semua Role</option><option value="Warga Kampus">Warga Kampus</option><option value="Pihak Kampus">Pihak Kampus</option><option value="Admin">Admin</option>
          </select>
        </div>
        {isLoading && daftarUser.length > 0 && <div className="ama-inline-loader" aria-live="polite">Memproses...</div>}
      </div>
      {error && <div className="ama-error-message-global" role="alert"><p>{error}</p><button onClick={() => fetchData()} className="ama-button primary">Coba Lagi</button></div>}
      {itemInDetailView ? (
        <AkunItem key={itemInDetailView.id} user={itemInDetailView} onToggleActive={userId => handleUserAction('toggleActive', userId)} onDeleteUser={userId => handleUserAction('deleteUser', userId)} isDetailView={true} onToggleDetail={handleToggleDetail} />
      ) : (
        filteredUsers.length > 0 ? (
          <div className="ama-list-container">
            {filteredUsers.map(user => (<AkunItem key={user.id} user={user} onToggleActive={userId => handleUserAction('toggleActive', userId)} onDeleteUser={userId => handleUserAction('deleteUser', userId)} isDetailView={false} onToggleDetail={handleToggleDetail} />))}
          </div>
        ) : (!isLoading && !error && <p className="ama-empty-state">Tidak ada pengguna yang cocok dengan filter atau pencarian Anda, atau belum ada data pengguna.</p>)
      )}
    </AdminLayout>
  );
};

export default AdminManajemenAkun;