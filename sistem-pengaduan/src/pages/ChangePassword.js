import React, { useState } from 'react';
import { FiLock, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import './Auth.css'; // Menggunakan CSS yang sama

const ChangePassword = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // State untuk menampilkan/menyembunyikan password
    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (newPassword.length < 8) {
            setError('Password baru minimal harus 8 karakter.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('Konfirmasi password baru tidak cocok.');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('http://127.0.0.1:8000/api/login/change-password/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    old_password: oldPassword,
                    new_password: newPassword
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message);
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                setError(data.error || 'Gagal mengubah password.');
            }
        } catch (err) {
            setError('Terjadi kesalahan pada jaringan atau server.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-box" style={{ margin: 'auto' }}>
                <h2>Ubah Password Anda</h2>
                <p style={{marginBottom: '20px', fontSize: '0.9em', color: '#666', textAlign: 'center'}}>
                    Untuk keamanan, masukkan password lama Anda diikuti dengan password baru.
                </p>
                <form onSubmit={handleChangePassword}>
                    <div className="input-icon">
                        <FiLock />
                        <input
                            type={showOld ? "text" : "password"}
                            placeholder="Password Lama"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            required
                        />
                        <span className="password-toggle" onClick={() => setShowOld(!showOld)}>
                            {showOld ? 'Hide' : 'Show'}
                        </span>
                    </div>
                    <div className="input-icon">
                        <FiLock />
                        <input
                            type={showNew ? "text" : "password"}
                            placeholder="Password Baru (min. 8 karakter)"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                         <span className="password-toggle" onClick={() => setShowNew(!showNew)}>
                            {showNew ? 'Hide' : 'Show'}
                        </span>
                    </div>
                    <div className="input-icon">
                        <FiLock />
                        <input
                            type={showConfirm ? "text" : "password"}
                            placeholder="Konfirmasi Password Baru"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                         <span className="password-toggle" onClick={() => setShowConfirm(!showConfirm)}>
                            {showConfirm ? 'Hide' : 'Show'}
                        </span>
                    </div>

                    {message && (
                        <div className="form-feedback success">
                            <FiCheckCircle /> {message}
                        </div>
                    )}
                    {error && (
                        <div className="form-feedback error">
                            <FiAlertCircle /> {error}
                        </div>
                    )}

                    <button type="submit" className="btn-auth" disabled={loading}>
                        {loading ? 'Menyimpan...' : 'Ubah Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;