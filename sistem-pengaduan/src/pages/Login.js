import React from 'react';
import './Auth.css';
import { FiUser, FiLock } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebookF } from 'react-icons/fa';

const Login = () => {
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
            <input type="text" placeholder="Username" />
        </div>
        <div className="input-icon">
            <FiLock />
            <input type="password" placeholder="Password" />
        </div>
        <button className="btn-auth">Login</button>
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
