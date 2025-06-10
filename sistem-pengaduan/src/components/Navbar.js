import React, { useState, useRef, useEffect, useCallback } from 'react';
import './Navbar.css';
import { FiBell } from 'react-icons/fi';
import defaultUser from '../assets/default-user.png';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext'; 

const Navbar = () => {
    const { unreadCount, fetchNotifications } = useNotifications();
    const [loggedIn, setLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [dropdown, setDropdown] = useState(false);
    const [profilePic, setProfilePic] = useState(defaultUser);
    const profileRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();

    const updateAuthState = useCallback(() => {
        const storedUserId = localStorage.getItem('user_id');
        const storedUsername = localStorage.getItem('username');
        const storedProfilePic = localStorage.getItem('profile_pic_url');
        
        if (storedUserId && storedUsername) {
            setLoggedIn(true);
            setUsername(storedUsername);
            setProfilePic(storedProfilePic && storedProfilePic !== 'null' ? storedProfilePic : defaultUser);
            if(fetchNotifications) fetchNotifications();
        } else {
            setLoggedIn(false);
            setUsername('');
            setProfilePic(defaultUser);
        }
    }, [fetchNotifications]);

    useEffect(() => {
        updateAuthState();
        window.addEventListener('storage', updateAuthState);
        return () => window.removeEventListener('storage', updateAuthState);
    }, [updateAuthState]);

    const handleLogout = () => {
        localStorage.clear();
        setDropdown(false);
        window.dispatchEvent(new Event('storage'));
        navigate('/');
    };
    
    const handleNavClick = (target) => {
        const path = location.pathname;
        if (path === '/') {
            if (target === 'home') { window.scrollTo({ top: 0, behavior: 'smooth' }); }
            else { const section = document.getElementById(target); if (section) section.scrollIntoView({ behavior: 'smooth' }); }
        } else {
            switch (target) {
                case 'home': navigate('/'); break;
                case 'pengaduan': navigate('/pengaduan'); break;
                case 'riwayat': navigate('/riwayat'); break;
                case 'about': navigate('/about'); break;
                case 'contact': navigate('/contact'); break;
                default: break;
            }
        }
    };
    const handleProfileClick = () => setDropdown(!dropdown);
    const handleAccount = () => {
        setDropdown(false);
        navigate(loggedIn ? '/profile' : '/login');
    };
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) setDropdown(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <nav className="navbar">
            <div className="logo" onClick={() => navigate('/')}>El-Lapor</div>
            <div className="navbar-content">
                <div className="nav-wrapper">
                    <ul className="nav-links">
                        <li><button onClick={() => handleNavClick('home')}>Home</button></li>
                        <li><button onClick={() => handleNavClick('pengaduan')}>Pengaduan</button></li>
                        <li><button onClick={() => handleNavClick('riwayat')}>Riwayat</button></li>
                        <li><button onClick={() => handleNavClick('about')}>About</button></li>
                        <li><button onClick={() => handleNavClick('contact')}>Contact</button></li>
                    </ul>
                </div>
            </div>
            <div className="profile-wrapper" ref={profileRef}>
                <div className="profile-text" onClick={handleProfileClick}>
                    {loggedIn ? `Hi, ${username}` : "Hi, Pengunjung"}
                    <p>{loggedIn ? "Apakah ada laporan hari ini?" : "Silakan login terlebih dahulu."}</p>
                </div>
                <Link to={loggedIn ? "/notifications" : "/login"} className="notification-bell">
                    {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
                    <FiBell className="notif-icon" />
                </Link>
                <img
                    key={profilePic}
                    src={profilePic}
                    className="profile-image" alt="profile"
                    onClick={handleProfileClick}
                    onError={(e) => { e.target.src = defaultUser; }}
                />
                {dropdown && (
                    <div className="dropdown">
                        {loggedIn ? (
                            <>
                                <a href="#account" onClick={(e) => { e.preventDefault(); handleAccount(); }}>Account</a>
                                <a href="#logout" onClick={(e) => { e.preventDefault(); handleLogout(); }}>Logout</a>
                            </>
                        ) : ( <a href="/login">Login</a> )}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
