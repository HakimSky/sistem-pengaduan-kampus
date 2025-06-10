import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

const NotificationContext = createContext();

export const useNotifications = () => {
    return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const userId = localStorage.getItem('user_id');

    const fetchNotifications = useCallback(async () => {
        if (!userId) {
            setLoading(false);
            setNotifications([]);
            setUnreadCount(0);
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/notifikasi/notifikasi/?user_id=${userId}`);
            if (!response.ok) throw new Error('Gagal mengambil notifikasi.');
            const data = await response.json();
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.status_baca).length);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const markAsRead = async (id) => {
        const targetNotif = notifications.find(n => n.id === id);
        if (!targetNotif || targetNotif.status_baca) return;

        const originalNotifications = [...notifications];
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, status_baca: true } : n));
        setUnreadCount(prev => prev > 0 ? prev - 1 : 0);
        
        try {
            // KIRIM user_id DI BODY. Hapus 'credentials'.
            await fetch(`http://127.0.0.1:8000/api/notifikasi/notifikasi/${id}/mark_as_read/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId }),
            });
        } catch (error) {
            console.error("Gagal menandai notifikasi:", error);
            setNotifications(originalNotifications);
            setUnreadCount(originalNotifications.filter(n => !n.status_baca).length);
        }
    };
    
    const markAllAsRead = async () => {
        const originalNotifications = [...notifications];
        setNotifications(prev => prev.map(n => ({ ...n, status_baca: true })));
        setUnreadCount(0);
        try {
            // KIRIM user_id DI BODY. Hapus 'credentials'.
            await fetch('http://127.0.0.1:8000/api/notifikasi/notifikasi/mark_all_as_read/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId }),
            });
        } catch (error) {
             console.error("Gagal menandai semua notifikasi:", error);
             setNotifications(originalNotifications);
             setUnreadCount(originalNotifications.filter(n => !n.status_baca).length);
        }
    };

    const value = {
        notifications,
        unreadCount,
        loading,
        fetchNotifications,
        markAsRead,
        markAllAsRead
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};
