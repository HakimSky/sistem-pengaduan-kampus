import React, { useEffect, useState } from 'react';
import './Profile.css';
import { FiUser, FiPhone, FiCalendar, FiUsers } from 'react-icons/fi';

const Profile = () => {
  const [mobile, setMobile] = useState('');

  const handleMobileChange = (e) => {
    const value = e.target.value;
    // Hapus semua karakter selain angka
    const numericValue = value.replace(/\D/g, '');
    setMobile(numericValue);
  };

  return (
    <div className="profile-container">
      <div className="profile-box">
        <h3>Set up Profile</h3>
        <div className="profile-header">
          <div className="profile-pic">
            <FiUser size={48} />
          </div>
          <div className="profile-info">
            <h4>hakim_123</h4>
            <p>Al Hakim</p>
          </div>
        </div>

        <form className="profile-form">
          <label>Personal Information</label>

          <div className="input-icon">
            <FiUser />
            <input type="text" placeholder="Username" />
          </div>

          <label>Contact Number</label>
          <div className="input-icon">
            <FiPhone />
            <input
              type="text" placeholder="0858-67******" value={mobile} 
              onChange={handleMobileChange} inputMode="numeric"
            />
          </div>

          <label>Date Of Birth</label>
          <div className="input-icon">
            <FiCalendar />
            <input type="date"/>
          </div>

          <label>Gender</label>
          <div className="input-icon">
            <FiUsers />
            <input type="text" placeholder="Male / Female" />
          </div>

          <button className="btn-save">Save</button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
