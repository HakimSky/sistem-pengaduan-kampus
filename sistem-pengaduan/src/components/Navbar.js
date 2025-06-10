import React, { useState, useRef, useEffect } from 'react';
import './Navbar.css';
import { FiBell } from 'react-icons/fi';
import defaultUser from '../assets/default-user.png';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [dropdown, setDropdown] = useState(false);
    const [profilePic, setProfilePic] = useState(defaultUser);

    const profileRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();

    // Fungsi ini akan membaca ulang data dari localStorage untuk memperbarui state
    const updateAuthState = () => {
        const storedUserId = localStorage.getItem('user_id');
        const storedUsername = localStorage.getItem('username');
        const storedProfilePic = localStorage.getItem('profile_pic_url');

        if (storedUserId && storedUsername) {
            setLoggedIn(true);
            setUsername(storedUsername);
            if (storedProfilePic && storedProfilePic !== 'null' && storedProfilePic !== 'undefined') {
                setProfilePic(storedProfilePic);
            } else {
                setProfilePic(defaultUser);
            }
        } else {
            setLoggedIn(false);
            setUsername('');
            setProfilePic(defaultUser);
        }
    };

    // Mengatur listener untuk mendeteksi perubahan
    useEffect(() => {
        updateAuthState(); // Panggil saat komponen pertama kali dimuat
        window.addEventListener('storage', updateAuthState); // Dengarkan sinyal dari halaman profil
        return () => {
            window.removeEventListener('storage', updateAuthState); // Cleanup listener
        };
    }, []);

    // --- FUNGSI NAVIGASI YANG DIPERBAIKI (KEMBALI KE LOGIKA ASLI) ---
    const handleNavClick = (target) => {
        const path = location.pathname;

        // Jika sedang di halaman utama ('/'), maka scroll
        if (path === '/') {
            if (target === 'home') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                const section = document.getElementById(target);
                if (section) {
                    section.scrollIntoView({ behavior: 'smooth' });
                }
            }
        } else {
            // Jika di halaman lain, lakukan navigasi
            switch (target) {
                case 'home':
                    navigate('/'); // 'home' selalu kembali ke root
                    break;
                case 'pengaduan':
                    navigate('/pengaduan');
                    break;
                case 'riwayat':
                    navigate('/riwayat');
                    break;
                case 'about':
                    navigate('/about');
                    break;
                case 'contact':
                    navigate('/contact');
                    break;
                default:
                    break;
            }
        }
    };
    
    // Sisa fungsi Anda
    const handleLogout = () => {
        localStorage.removeItem('user_id');
        localStorage.removeItem('username');
        localStorage.removeItem('profile_pic_url');
        setDropdown(false);
        window.dispatchEvent(new Event('storage')); // Kirim sinyal agar state direset
        navigate('/');
    };

    const handleProfileClick = () => setDropdown(!dropdown);

    const handleAccount = () => {
        setDropdown(false);
        navigate(loggedIn ? '/profile' : '/login');
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setDropdown(false);
            }
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
                <Link to={loggedIn ? "/notifications" : "/login"}>
                    <FiBell className="notif-icon" />
                </Link>
                
                <img
                    key={profilePic} // Memaksa re-render saat URL gambar berubah
                    src={profilePic}
                    className="profile-image"
                    alt="profile"
                    onClick={handleProfileClick}
                    onError={(e) => { e.target.onerror = null; e.target.src = defaultUser; }}
                />

                {dropdown && (
                    <div className="dropdown">
                        {loggedIn ? (
                            <>
                                <a href="#account" onClick={(e) => { e.preventDefault(); handleAccount(); }}>Account</a>
                                <a href="#logout" onClick={(e) => { e.preventDefault(); handleLogout(); }}>Logout</a>
                            </>
                        ) : (
                            <a href="/login">Login</a>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
