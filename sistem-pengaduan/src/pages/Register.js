import React, { useState } from 'react';
import './Auth.css';
import { FiUser, FiLock, FiPhone, FiMail } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebookF } from 'react-icons/fa';
import { FaUserGraduate, FaTransgender } from 'react-icons/fa';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [programStudi, setProgramStudi] = useState('');
  const [jenisKelamin, setJenisKelamin] = useState('Laki-laki');

  const handleRegister = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/login/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
          full_name: fullName,
          number: mobile,
          program_studi: programStudi,
          jenis_kelamin: jenisKelamin,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Registrasi berhasil!');
        window.location.href = '/login';
      } else {
        alert(data.message || 'Registrasi gagal');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan saat registrasi');
    }
  };

  const handleMobileChange = (e) => {
    const numericValue = e.target.value.replace(/\D/g, '');
    setMobile(numericValue);
  };

  return (
    <div className="auth-page">
      <div className="auth-left1">
        <div className="auth-box">
          <h2>Register</h2>
          <div className="input-icon"><FiUser /><input type="text" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} /></div>
          <div className="input-icon"><FiUser /><input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} /></div>
          <div className="input-icon"><FiPhone /><input type="text" placeholder="Mobile Number" value={mobile} onChange={handleMobileChange} inputMode="numeric" /></div>
          <div className="input-icon"><FiMail /><input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          <div className="input-icon"><FiLock /><input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
          {/* Program Studi */}
          <div className="input-icon">
            <FaUserGraduate />
            <input
              type="text"
              placeholder="Program Studi"
              value={programStudi}
              onChange={(e) => setProgramStudi(e.target.value)}
            />
          </div>

          {/* Jenis Kelamin */}
          <div className="input-icon">
            <FaTransgender />
            <select value={jenisKelamin} onChange={(e) => setJenisKelamin(e.target.value)}>
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
          </div>
          <button className="btn-auth-outline" onClick={handleRegister}>Sign Up</button>
          <div className="or-divider">or</div>
          <div className="social-login">
            <button><FcGoogle size={20} /></button>
            <button><FaFacebookF size={20} color="#1877f2" /></button>
          </div>
          <p>Already have an account? <a href="/login">Login</a></p>
        </div>
      </div>
      <div className="auth-right1">
        <h1>Welcome to EL-Lapor</h1>
      </div>
    </div>
  );
};

export default Register;
