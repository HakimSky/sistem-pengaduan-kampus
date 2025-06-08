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
            {role === "Admin" && <FiShield size={20} />}
            {role === "Pihak Kampus" && <FiUserCheck size={20} />}
            {role === "Warga Kampus" && <FiUser size={20} />}
            {role === "Tidak Diketahui" && <FiUser size={20} />}
          </div>
          <div className="ama-list-item-info">
            <h4 className="ama-list-item-title">{user.username}</h4>
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
          <button className="ama-button-icon ama-button-detail-toggle"><FiChevronDown size={18} /></button>
        </div>
      </div>
    );
  }

  return (
    <div className="ama-card-detail">
      <div className="ama-detail-header">
        <h3 className="ama-detail-title">{user.username}</h3>
        <button onClick={() => onToggleDetail(null)} className="ama-button-icon ama-button-close"><FiX size={20} /></button>
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
          <p><FiCalendar /> <strong>Tanggal Bergabung:</strong> {user.date_joined ? new Date(user.date_joined).toLocaleString('id-ID') : "N/A"}</p>
          <p><strong>Login Terakhir:</strong> {user.last_login ? new Date(user.last_login).toLocaleString('id-ID') : "Belum pernah login"}</p>
        </div>
      </div>
      <div className="ama-detail-actions-section">
        <strong className="ama-detail-section-title">Aksi Manajemen</strong>
        {!isAdminUser && (
          <>
            <div className="ama-action-buttons">
              <button className={`ama-button ${user.is_active ? 'warning' : 'success'}`} onClick={handleToggleActive}>
                {user.is_active ? <><FiUserX /> Nonaktifkan</> : <><FiUserCheck /> Aktifkan</>}
              </button>
              <button className="ama-button danger" onClick={() => setShowConfirmDelete(true)}><FiTrash2 /> Hapus Akun</button>
            </div>
            {showConfirmDelete && (
              <div className="ama-confirm-delete">
                <p><strong>Anda yakin ingin menghapus akun {user.username}?</strong> Tindakan ini tidak dapat diurungkan.</p>
                <button className="ama-button danger" onClick={handleDelete}>Ya, Hapus</button>
                <button className="ama-button secondary" onClick={() => setShowConfirmDelete(false)}>Batal</button>
              </div>
            )}
          </>
        )}
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

  const fetchData = useCallback(() => {
    setIsLoading(true);
    fetch(API_URL_USERS, {
      credentials: 'include',
    })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        setDaftarUser(data.results || data);
        setError(null);
      })
      .catch((err) => {
        console.error("Gagal mengambil data user:", err);
        setError(`Gagal memuat data: ${err.message}.`);
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUserAction = useCallback(async (actionType, userId) => {
    setIsLoading(true);
    let url = `${API_URL_USERS}${userId}/`;
    let method = "";
    let alertMessage = "";

    if (actionType === 'toggleActive') {
      url = `${API_URL_USERS}${userId}/toggle-active/`;
      method = "PATCH";
      alertMessage = `Status akun berhasil diubah.`;
    } else if (actionType === 'deleteUser') {
      method = "DELETE";
      alertMessage = `Akun berhasil dihapus.`;
    } else {
      console.warn("Tipe aksi tidak dikenal:", actionType);
      setIsLoading(false);
      return;
    }

    try {
      console.log(`Mengirim ${method} ke ${url} untuk userId: ${userId}`); // Debug
      const response = await fetch(url, {
        method: method,
        credentials: 'include',
      });

      if (!response.ok && response.status !== 204) {
        const errorText = await response.text();
        throw new Error(`Gagal melakukan aksi ${actionType} (Status: ${response.status}): ${errorText}`);
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
      console.error(`Kesalahan saat ${actionType} untuk user ID ${userId}:`, err);
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
          <FiFilter />
          <input type="search" placeholder="Cari username, email, nama..." value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setDetailViewId(null); }} className="ama-search-input" />
          <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setDetailViewId(null); }} className="ama-filter-select">
            <option value="Semua">Semua Status</option><option value="Aktif">Aktif</option><option value="Nonaktif">Nonaktif</option>
          </select>
          <select value={filterRole} onChange={e => { setFilterRole(e.target.value); setDetailViewId(null); }} className="ama-filter-select">
            <option value="Semua">Semua Role</option><option value="Warga Kampus">Warga Kampus</option><option value="Pihak Kampus">Pihak Kampus</option><option value="Admin">Admin</option>
          </select>
        </div>
        {isLoading && daftarUser.length > 0 && <div className="ama-inline-loader">Memproses...</div>}
      </div>
      {error && <div className="ama-error-message-global"><p>{error}</p><button onClick={() => fetchData()} className="ama-button primary">Coba Lagi</button></div>}
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