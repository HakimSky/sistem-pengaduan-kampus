import React, { useState } from 'react';
import './Auth.css';
import { FiUser, FiLock } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebookF } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      // Step 1: Lakukan autentikasi
      const loginResponse = await fetch('http://127.0.0.1:8000/api/login/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });

      const loginData = await loginResponse.json();

      if (!loginResponse.ok) {
        throw new Error(loginData.error || 'Username atau password salah.');
      }

      // Jika login berhasil, simpan data dasar
      localStorage.setItem('user_id', loginData.user_id);
      localStorage.setItem('username', loginData.username);
      sessionStorage.setItem('is_staff', loginData.is_staff);

      // Step 2: Ambil profil LENGKAP untuk mendapatkan URL gambar
      const profileResponse = await fetch('http://127.0.0.1:8000/api/warga-kampus/warga-kampus/');
      const profileList = await profileResponse.json();
      
      const userProfile = profileList.find(item => String(item.user) === String(loginData.user_id));

      if (userProfile && userProfile.foto_profil_url) {
        // Step 3: Simpan URL gambar ke localStorage
        localStorage.setItem('profile_pic_url', userProfile.foto_profil_url);
      } else {
        // Jika tidak ada foto, pastikan item di localStorage kosong
        localStorage.removeItem('profile_pic_url');
      }
      
      // Step 4: Kirim sinyal bahwa penyimpanan sudah selesai
      window.dispatchEvent(new Event('storage'));

      // Step 5: Lakukan redirect
      if (loginData.is_staff === true) {
        window.location.href = '/admin';
      } else if (username.toLowerCase() === 'ums_x_1') {
        window.location.href = '/pihakkampus';
      } else {
        window.location.href = '/';
      }

    } catch (err) {
      setError(err.message);
      console.error('Terjadi kesalahan saat proses login:', err);
    } finally {
      setLoading(false);
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
          {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '15px' }}>{error}</p>}
          <div className="input-icon">
            <FiUser />
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div className="input-icon">
            <FiLock />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleLogin()} />
          </div>
          <div style={{ textAlign: 'right', width: '100%', marginTop: '10px', marginBottom: '15px' }}>
            <Link to="/forgot-password" style={{ fontSize: '0.9em' }}>Lupa Password?</Link>
          </div>
          <button className="btn-auth" onClick={handleLogin} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
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
