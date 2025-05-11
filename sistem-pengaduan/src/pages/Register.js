import React, { useState } from 'react';
import './Auth.css';
import { FiUser, FiLock, FiPhone, FiMail } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebookF } from 'react-icons/fa';

const Register = () => {
  const [mobile, setMobile] = useState('');

  const handleMobileChange = (e) => {
    const value = e.target.value;
    // Hapus semua karakter selain angka
    const numericValue = value.replace(/\D/g, '');
    setMobile(numericValue);
  };

  return (
    <div className="auth-page">
      <div className="auth-left1">
        <div className="auth-box">
          <h2>Register</h2>
          <div className="input-icon">
            <FiUser />
            <input type="text" placeholder="Full Name" />
          </div>
          <div className="input-icon">
            <FiUser />
            <input type="text" placeholder="Username" />
          </div>
          <div className="input-icon">
            <FiPhone />
            <input
              type="text" placeholder="Mobile Number" value={mobile} 
              onChange={handleMobileChange} inputMode="numeric"
            />
          </div>
          <div className="input-icon">
            <FiMail />
            <input type="email" placeholder="Email Address" />
          </div>
          <div className="input-icon">
            <FiLock />
            <input type="password" placeholder="Password" />
          </div>
          <button className="btn-auth-outline">Sign Up</button>
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
