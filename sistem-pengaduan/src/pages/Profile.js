import React, { useEffect, useState } from 'react';
import './Profile.css';
import { FiUser, FiPhone } from 'react-icons/fi';
import { MdSchool } from 'react-icons/md';
import { BsGenderAmbiguous } from 'react-icons/bs';
import { FiArrowLeft } from 'react-icons/fi'; // untuk ikon panah
import { useNavigate } from 'react-router-dom'; // untuk navigasi

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editData, setEditData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    if (userId) {
      fetch('http://127.0.0.1:8000/api/warga-kampus/warga-kampus/')
        .then(res => res.json())
        .then(data => {
          const userProfile = data.find(item => item.user == userId);
          if (userProfile) {
            setProfileData(userProfile);
            setEditData({
              nama: userProfile.nama || '',
              no_hp: userProfile.no_hp || '',
              program_studi: userProfile.program_studi || '',
              jenis_kelamin: userProfile.jenis_kelamin || '',
              email: userProfile.email || '',
              user: userProfile.user || ''
            });
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    if (!profileData || !profileData.id) return;

    // Kirim semua data termasuk email & user
    fetch(`http://127.0.0.1:8000/api/warga-kampus/warga-kampus/${profileData.id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(editData)
    })
      .then(res => {
        if (!res.ok) throw new Error("Gagal menyimpan perubahan.");
        return res.json();
      })
      .then(updated => {
        setProfileData(updated);
        alert('Profil berhasil diperbarui!');
      })
      .catch(err => {
        console.error(err);
        alert('Gagal memperbarui profil.');
      });
  };

  return (
    <div className="profile-container">
      <div className="profile-box">
        <div className="profile-title">
          <FiArrowLeft
            size={24}
            style={{ cursor: 'pointer', marginRight: '100px' }}
            onClick={() => navigate('/')} // ganti '/dashboard' sesuai rute kamu
          />
          <h3>My Profile</h3>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : profileData ? (
          <>
            <div className="profile-header">
              <div className="profile-pic">
                <FiUser size={48} />
              </div>
              <div className="profile-info">
                <h4>ID: {profileData.user}</h4>
                <p>{editData.nama}</p>
              </div>
            </div>

            <form className="profile-form" onSubmit={(e) => e.preventDefault()}>
              <label>Nama</label>
              <div className="input-icon">
                <FiUser />
                <input
                  type="text"
                  name="nama"
                  value={editData.nama}
                  onChange={handleChange}
                />
              </div>

              <label>Email</label>
              <div className="input-icon">
                <FiUser />
                <input
                  type="email"
                  name="email"
                  value={editData.email}
                  onChange={handleChange}
                />
              </div>

              <label>Nomor HP</label>
              <div className="input-icon">
                <FiPhone />
                <input
                  type="text"
                  name="no_hp"
                  value={editData.no_hp}
                  onChange={handleChange}
                />
              </div>

              <label>Program Studi</label>
              <div className="input-icon">
                <MdSchool />
                <input
                  type="text"
                  name="program_studi"
                  value={editData.program_studi}
                  onChange={handleChange}
                />
              </div>

              <label>Jenis Kelamin</label>
              <div className="input-icon">
                <BsGenderAmbiguous />
                <select
                  name="jenis_kelamin"
                  value={editData.jenis_kelamin}
                  onChange={handleChange}
                >
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>

              <button className="btn-save" type="button" onClick={handleSave}>
                Save
              </button>
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
