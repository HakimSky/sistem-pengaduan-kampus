import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import './Auth.css';

const AuthWrapper = () => {
  const [isRegister, setIsRegister] = useState(false);

  return (
    <div className="auth-wrapper">
      <div className={`auth-slider ${isRegister ? 'slide-left' : ''}`}>
        <div className="auth-page-wrapper">
          <Login onSwitch={() => setIsRegister(true)} />
        </div>
        <div className="auth-page-wrapper">
          <Register onSwitch={() => setIsRegister(false)} />
        </div>
      </div>
    </div>
  );
};

export default AuthWrapper;
