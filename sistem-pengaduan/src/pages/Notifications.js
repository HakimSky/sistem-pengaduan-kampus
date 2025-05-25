import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { FiBell } from 'react-icons/fi';
import './Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wargaKampusId, setWargaKampusId] = useState(null);
  const userId = localStorage.getItem('user_id');

  // Step 1: Fetch data warga kampus, dapetin ID warga kampus
  useEffect(() => {
    const fetchWargaKampus = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/warga-kampus/warga-kampus/');
        const data = await res.json();
        const userProfile = data.find(item => item.user == userId);
        if (userProfile) {
          setWargaKampusId(userProfile.id);
        }
      } catch (err) {
        console.error('Error fetching warga kampus:', err);
      }
    };

    fetchWargaKampus();
  }, [userId]);

  // Step 2: Fetch notifikasi dan filter sesuai penerima (id warga kampus)
  useEffect(() => {
    if (wargaKampusId) {
      const fetchNotifications = async () => {
        try {
          const res = await fetch('http://127.0.0.1:8000/api/notifikasi/notifikasi/');
          const data = await res.json();
          const filteredNotifications = data.filter(
            notif => notif.penerima === wargaKampusId
          );
          setNotifications(filteredNotifications);
        } catch (err) {
          console.error('Error fetching notifikasi:', err);
          setNotifications([]);
        } finally {
          setLoading(false);
        }
      };

      fetchNotifications();
    }
  }, [wargaKampusId]);

  return (
    <>
      <Navbar />
      <div className="notifications-container">
        <h2><FiBell /> Notifikasi</h2>

        {loading ? (
          <p>Memuat notifikasi...</p>
        ) : notifications.length === 0 ? (
          <p>Tidak ada notifikasi untuk Anda.</p>
        ) : (
          <ul className="notifications-list">
            {notifications.map((notif) => (
              <li key={notif.id} className={notif.status_baca ? 'read' : 'unread'}>
                <p><strong>{notif.jenis}</strong> - {notif.pesan}</p>
                <small>{new Date(notif.waktu_dikirim).toLocaleString()}</small>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default Notifications;
