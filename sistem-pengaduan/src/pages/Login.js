import React, { useState } from 'react';
import './Auth.css';
import { FiUser, FiLock } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebookF } from 'react-icons/fa';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/login/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Pastikan cookie dikirim
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Login berhasil!');
        console.log('Response:', data);
        localStorage.setItem('user_id', data.user_id);
        localStorage.setItem('username', username);
        sessionStorage.setItem('is_staff', data.is_staff);
        // Simpan session key kalo ada
        if (data.session_key) {
          document.cookie = `sessionid=${data.session_key}; path=/; SameSite=Lax; Secure=false`; // False buat dev
        }
        if (data.is_staff === true) {
          window.location.href = '/admin';
        } else if (username.toLowerCase() === 'ums_x_1') {
          window.location.href = '/pihakkampus';
        } else {
          window.location.href = '/';
        }
      } else {
        alert(data.message || 'Login gagal');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan saat login');
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
            />
          </div>
          <button className="btn-auth" onClick={handleLogin}>Login</button>
          <div className="or-divider">or</div>
          <div className="social-login">
            <button><FcGoogle size={20} /></button>
            <button><FaFacebookF size={20} color="#1877f2" /></button>
          </div>
          <p>Don't have an account? <a href="/register">Sign Up</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login;