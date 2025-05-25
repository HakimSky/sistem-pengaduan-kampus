import React, { useState, useRef, useEffect } from 'react';
import './Navbar.css';
import { FiBell } from 'react-icons/fi';
import user1 from '../assets/Image/Profil/user1.jpeg';
import defaultUser from '../assets/default-user.png';
import { Link } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [dropdown, setDropdown] = useState(false);
  const profileRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Saat halaman dimuat, cek apakah user sudah login
  useEffect(() => {
    const storedUserId = localStorage.getItem('user_id');
    const storedUsername = localStorage.getItem('username');

    if (storedUserId && storedUsername) {
      setLoggedIn(true);
      setUsername(storedUsername);
    } else {
      setLoggedIn(false);
      setUsername('');
    }
  }, []);

  const handleNavClick = (targetId) => {
    if (location.pathname === '/') {
      const section = document.getElementById(targetId);
      section?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(`/?scrollTo=${targetId}`);
    }
  };

  const handleProfileClick = () => {
    setDropdown(!dropdown);
  };

  const handleAccount = () => {
    setDropdown(false);
    if (loggedIn) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user_id');
    localStorage.removeItem('username');
    setLoggedIn(false);
    setUsername('');
    setDropdown(false);
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="logo" onClick={() => window.location.reload()}>
        El-Lapor
      </div>

      <div className="nav-wrapper">
        <ul className="nav-links">
          <li><a href="/" onClick={() => handleNavClick('home')}>Home</a></li>
          <li><a href="/pengaduan" onClick={() => handleNavClick('pengaduan')}>Pengaduan</a></li>
          <li><a href="#riwayat" onClick={() => handleNavClick('riwayat')}>Riwayat</a></li>
          <li><a href="#about" onClick={() => handleNavClick('about')}>About</a></li>
          <li><a href="#contact" onClick={() => handleNavClick('contact')}>Contact</a></li>
        </ul>
      </div>

      <div className="profile-wrapper" ref={profileRef} onClick={handleProfileClick}>
        <div className="profile-text">
          {loggedIn ? `Hi, ${username}` : "Hi, Pengunjung"}
          <p>{loggedIn ? "Apakah ada laporan hari ini?" : "Silakan login terlebih dahulu."}</p>
        </div>

        <Link to={loggedIn ? "/notifications" : "/login"}>
          <FiBell className="notif-icon" />
        </Link>

        <img
          src={loggedIn ? user1 : defaultUser}
          className="profile-image"
          alt="profile"
        />

        {dropdown && (
          <div className="dropdown">
            {loggedIn ? (
              <>
                <a href="#account" onClick={(e) => { e.preventDefault(); handleAccount(); }}>
                  Account
                </a>
                <a href="#logout" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
                  Logout
                </a>
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
