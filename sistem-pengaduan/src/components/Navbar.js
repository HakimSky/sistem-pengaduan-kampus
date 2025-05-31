import React, { useState, useRef, useEffect } from 'react';
import './Navbar.css';
import { FiBell } from 'react-icons/fi';
import user1 from '../assets/Image/Profil/user1.jpeg';
import defaultUser from '../assets/default-user.png';
import { Link , useLocation, useNavigate } from 'react-router-dom';

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

  const handleNavClick = (target) => {
    const path = location.pathname;

    if (path === '/') {
      // Kalau di dashboard, scroll ke elemen
      const section = document.getElementById(target);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Di luar dashboard, atur navigasi sesuai kebutuhan
      switch (target) {
        case 'home':
          navigate('/', { state: { scrollTo: '/' } });
          break;
        case 'about':
          navigate('/', { state: { scrollTo: 'about' } });
          break;
        case 'contact':
          navigate('/', { state: { scrollTo: 'contact' } });
          break;
        case 'pengaduan':
          if (path === '/pengaduan') {
            window.location.reload(); // refresh
          } else {
            navigate('/pengaduan');
          }
          break;
        case 'riwayat':
          if (path === '/riwayat') {
            window.location.reload(); // refresh
          } else {
            navigate('/riwayat');
          }
          break;
        // case 'riwayat':
        //   navigate('/riwayat');
        //   break;
        default:
          break;
      }
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
