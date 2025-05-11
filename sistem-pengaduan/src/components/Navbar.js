import React, { useState, useRef, useEffect } from 'react';
import './Navbar.css';
import { FiBell } from 'react-icons/fi';
import user1 from '../assets/Image/Profil/user1.jpeg';
import defaultUser from '../assets/default-user.png';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [loggedIn, setLoggedIn] = useState(true);
  const [dropdown, setDropdown] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  const handleProfileClick = () => {
    setDropdown(!dropdown);
  };

  const handleAccount = () => {
    setDropdown(false);
    if (loggedIn) {
      navigate('/profile');      // ✅ Kalau sudah login → ke profile
    } else {
      navigate('/login');        // ✅ Kalau belum login → ke login
    }
  };

  const handleLogout = () => {
  setLoggedIn(false); 
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
          <li><a href="#home">Home</a></li>
          <li><a href="#pengaduan">Pengaduan</a></li>
          <li><a href="#riwayat">Riwayat</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </div>

      <div className="profile-wrapper" ref={profileRef} onClick={handleProfileClick}>
        <div className="profile-text">
          {loggedIn ? "Hi, Putri" : "Hi, ?"}
          <p>{loggedIn ? "Apakah ada laporan hari ini?" : "Apakah sudah daftar hari ini?"}</p>
        </div>

        <Link to="/notifications">
          <FiBell className="notif-icon" />
        </Link>

        <img
          src={loggedIn ? user1 : defaultUser}
          className="profile-image"
          alt="profile"
        />
        {dropdown && (
          <div className="dropdown">
            <a href="#account" onClick={(e) => { e.preventDefault(); handleAccount(); }}>
              Account
            </a>
            <a href="#logout" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
              Logout
            </a>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
