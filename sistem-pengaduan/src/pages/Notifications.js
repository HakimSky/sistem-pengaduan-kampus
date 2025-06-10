import React from 'react';
import Navbar from '../components/Navbar';
import { useNotifications } from '../context/NotificationContext';
import { FiBell, FiCheckCircle, FiBookOpen, FiAlertTriangle } from 'react-icons/fi';
import './Notifications.css';

const Notifications = () => {
    // Ambil semua yang dibutuhkan dari Context. Jadi lebih bersih!
    const { notifications, loading, markAsRead, markAllAsRead } = useNotifications();

    const getIconForType = (type) => {
        const props = { size: 22, className: "notif-icon" };
        switch (type) {
            case 'Pengaduan': return <FiBell {...props} style={{ color: '#17a2b8' }} />;
            case 'Verifikasi': return <FiCheckCircle {...props} style={{ color: '#28a745' }} />;
            case 'Sistem': return <FiBookOpen {...props} style={{ color: '#6f42c1' }} />;
            default: return <FiAlertTriangle {...props} />;
        }
    };
    
    return (
        <>
            <Navbar />
            <div className="notifications-page-container">
                <div className="notifications-box">
                    <div className="notifications-header">
                        <h2><FiBell /> Notifikasi</h2>
                        {notifications.some(n => !n.status_baca) && (
                            <button onClick={markAllAsRead} className="mark-all-read-btn">
                                Tandai semua dibaca
                            </button>
                        )}
                    </div>
                    {loading ? (
                        <div className="loading-state">Memuat notifikasi...</div>
                    ) : notifications.length === 0 ? (
                        <div className="no-notifications">
                            <FiCheckCircle size={40} />
                            <p>Tidak ada notifikasi untuk Anda.</p>
                        </div>
                    ) : (
                        <ul className="notifications-list">
                            {notifications.map((notif) => (
                                <li 
                                    key={notif.id} 
                                    className={notif.status_baca ? 'read' : 'unread'}
                                    onClick={() => markAsRead(notif.id)}
                                >
                                    {getIconForType(notif.jenis)}
                                    <div className="notif-content">
                                        <p><strong>{notif.jenis}</strong> - {notif.pesan}</p>
                                        <small>{new Date(notif.waktu_dikirim).toLocaleString('id-ID')}</small>
                                    </div>
                                    {!notif.status_baca && <div className="unread-dot"></div>}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </>
    );
};

export default Notifications;
