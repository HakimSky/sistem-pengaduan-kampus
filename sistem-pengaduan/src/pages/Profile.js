import React, { useEffect, useState, useRef } from 'react';
import './Profile.css';
import { FiUser, FiPhone, FiEdit2, FiArrowLeft, FiMail } from 'react-icons/fi';
import { MdSchool } from 'react-icons/md';
import { BsGenderAmbiguous } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import defaultUser from '../assets/default-user.png';

const Profile = () => {
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editData, setEditData] = useState({});
    const navigate = useNavigate();
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(defaultUser);
    const fileInputRef = useRef(null);
    const username = localStorage.getItem('username');

    // Mengambil data profil saat halaman dimuat
    useEffect(() => {
        const userId = localStorage.getItem('user_id');
        if (userId) {
            fetch('http://127.0.0.1:8000/api/warga-kampus/warga-kampus/')
                .then(res => res.json())
                .then(data => {
                    const userProfile = data.find(item => String(item.user) === String(userId));
                    if (userProfile) {
                        setProfileData(userProfile);
                        setEditData({
                            nama: userProfile.nama || '',
                            no_hp: userProfile.no_hp || '',
                            program_studi: userProfile.program_studi || '',
                            jenis_kelamin: userProfile.jenis_kelamin || 'Laki-laki',
                            email: userProfile.email || '',
                        });
                        
                        // KUNCI PERBAIKAN: Langsung gunakan URL dari server, JANGAN TAMBAHKAN domain lagi.
                        const imageUrl = userProfile.foto_profil_url || defaultUser;
                        setPreview(imageUrl);
                    }
                    setLoading(false);
                }).catch(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleChange = (e) => {
        setEditData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = () => {
        if (!profileData) return;

        const formData = new FormData();
        Object.entries(editData).forEach(([key, value]) => formData.append(key, value));
        if (selectedFile) formData.append('foto_profil', selectedFile);

        fetch(`http://127.0.0.1:8000/api/warga-kampus/warga-kampus/${profileData.id}/`, {
            method: 'PATCH',
            body: formData,
        })
        .then(res => res.json())
        .then(updated => {
            if (updated.id) {
                alert('Profil berhasil diperbarui!');
                
                // KUNCI PERBAIKAN: Langsung gunakan URL dari server.
                const newImageUrl = updated.foto_profil_url || defaultUser;

                // Simpan URL yang benar ke localStorage
                localStorage.setItem('profile_pic_url', newImageUrl);
                // Kirim sinyal ke Navbar untuk update
                window.dispatchEvent(new Event('storage'));

                // Update tampilan di halaman ini
                setPreview(newImageUrl);
                setProfileData(updated);
                setSelectedFile(null);
            } else {
                throw new Error("Update gagal.");
            }
        })
        .catch(err => {
            console.error("Gagal menyimpan profil:", err);
            alert('Gagal memperbarui profil.');
        });
    };

    return (
        <div className="profile-container">
            <div className="profile-box">
                <div className="profile-title">
                    <FiArrowLeft size={24} style={{ cursor: 'pointer' }} onClick={() => navigate(-1)} />
                    <h3>My Profile</h3>
                    <div style={{width: 24}}></div>
                </div>
                {loading ? <p>Loading...</p> : profileData ? (
                    <>
                        <div className="profile-header">
                            <div className="profile-pic-wrapper">
                                <img src={preview} alt="Profile" className="profile-pic-large" onError={(e) => { e.target.src = defaultUser; }} />
                                <button className="edit-pic-button" onClick={() => fileInputRef.current.click()}><FiEdit2 size={14} /></button>
                                <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} accept="image/*" />
                            </div>
                            <div className="profile-info">
                                <h4>{username || 'Username'}</h4>
                                <p>{editData.nama}</p>
                            </div>
                        </div>
                        <form className="profile-form" onSubmit={(e) => e.preventDefault()}>
                            <label>Nama</label>
                            <div className="input-icon"><FiUser /><input type="text" name="nama" value={editData.nama} onChange={handleChange} /></div>
                            <label>Email</label>
                            <div className="input-icon"><FiMail /><input type="email" name="email" value={editData.email} onChange={handleChange} /></div>
                            <label>Nomor HP</label>
                            <div className="input-icon"><FiPhone /><input type="text" name="no_hp" value={editData.no_hp} onChange={handleChange}/></div>
                            <label>Program Studi</label>
                            <div className="input-icon"><MdSchool /><input type="text" name="program_studi" value={editData.program_studi} onChange={handleChange}/></div>
                            <label>Jenis Kelamin</label>
                            <div className="input-icon"><BsGenderAmbiguous /><select name="jenis_kelamin" value={editData.jenis_kelamin} onChange={handleChange}><option value="Laki-laki">Laki-laki</option><option value="Perempuan">Perempuan</option></select></div>
                            <button className="btn-save" type="button" onClick={handleSave}>Save Changes</button>
                        </form>
                    </>
                ) : <p>Profil tidak ditemukan.</p>}
            </div>
        </div>
    );
};

export default Profile;
