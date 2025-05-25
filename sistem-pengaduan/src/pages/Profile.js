import React, { useEffect, useState } from 'react';
import './Profile.css';
import { FiUser, FiPhone } from 'react-icons/fi';
import { MdSchool } from 'react-icons/md'; // Icon program studi
import { BsGenderAmbiguous } from 'react-icons/bs'; // Icon gender

const Profile = () => {
  const [profileData, setProfileData] = useState(null); // Awalnya null agar bisa validasi
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    if (userId) {
      fetch('http://127.0.0.1:8000/api/warga-kampus/warga-kampus/')
        .then(res => res.json())
        .then(data => {
          const userProfile = data.find(item => item.user == userId); // Cari user yang cocok
          if (userProfile) {
            setProfileData(userProfile);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <div className="profile-container">
      <div className="profile-box">
        <h3>My Profile</h3>

        {loading ? (
          <p>Loading...</p>
        ) : profileData ? (
          <>
            <div className="profile-header">
              <div className="profile-pic">
                <FiUser size={48} />
              </div>
              <div className="profile-info">
                <h4>{profileData.user}</h4>
                <p>{profileData.nama}</p>
              </div>
            </div>

            <form className="profile-form">
              <label>Personal Information</label>
              <div className="input-icon">
                <FiUser />
                <input type="text" value={profileData.nama || ''} readOnly />
              </div>

              <label>Contact Number</label>
              <div className="input-icon">
                <FiPhone />
                <input type="text" value={profileData.no_hp || ''} readOnly />
              </div>

              <label>Program Studi</label>
              <div className="input-icon">
                <MdSchool />
                <input type="text" value={profileData.program_studi || ''} readOnly />
              </div>

              <label>Gender</label>
              <div className="input-icon">
                <BsGenderAmbiguous />
                <input type="text" value={profileData.jenis_kelamin || ''} readOnly />
              </div>

              <button className="btn-save" type="button">Save</button>
            </form>
          </>
        ) : (
          <p>Data profil tidak ditemukan.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
