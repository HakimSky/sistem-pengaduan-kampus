import React, { useState } from 'react';
import './Auth.css'; // Pastikan path CSS ini benar
import { FiUser, FiLock } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebookF } from 'react-icons/fa';
import { Link } from 'react-router-dom'; // Import Link

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State untuk menampilkan pesan error

  const handleLogin = async () => {
    setError(''); // Reset error setiap kali login
    try {
      const response = await fetch('http://127.0.0.1:8000/api/login/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Mengizinkan browser mengirim dan menerima cookie secara otomatis
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Simpan data user ke localStorage
        localStorage.setItem('user_id', data.user_id);
        localStorage.setItem('username', data.username);
        sessionStorage.setItem('is_staff', data.is_staff);
        
        // Browser akan menangani cookie 'sessionid' secara otomatis.

        // Logika redirect setelah login berhasil
        if (data.is_staff === true) {
          window.location.href = '/admin'; // Atau ke halaman dashboard admin
        } else if (username.toLowerCase() === 'ums_x_1') { // Ganti dengan logika role pihak kampus yang lebih baik
          window.location.href = '/pihakkampus';
        } else {
          window.location.href = '/'; // Redirect ke halaman utama untuk user biasa
        }

      } else {
        setError(data.message || data.error || 'Login gagal. Periksa kembali username dan password.');
      }
    } catch (error) {
      console.error('Terjadi kesalahan saat proses login:', error);
      setError('Terjadi kesalahan pada jaringan atau server.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <h1>Welcome to EL-Lapor</h1>
      </div>
      <div className="auth-right">
        <div className="auth-box">
          <h2>Login</h2>
          {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
          <div className="input-icon">
            <FiUser />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="input-icon">
            <FiLock />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()} // Tambahan: login dengan tombol enter
            />
          </div>
          
          {/* --- PERUBAHAN DI SINI --- */}
          <div style={{ textAlign: 'right', width: '100%', marginTop: '10px', marginBottom: '15px' }}>
            <Link to="/forgot-password" style={{ fontSize: '0.9em' }}>Lupa Password?</Link>
          </div>
          {/* --- AKHIR PERUBAHAN --- */}

          <button className="btn-auth" onClick={handleLogin}>Login</button>
          <div className="or-divider">or</div>
          <div className="social-login">
            <button><FcGoogle size={20} /></button>
            <button><FaFacebookF size={20} color="#1877f2" /></button>
          </div>
          <p>Don't have an account? <Link to="/register">Sign Up</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
