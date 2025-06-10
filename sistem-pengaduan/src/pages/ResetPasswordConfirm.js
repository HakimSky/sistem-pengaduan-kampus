import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiLock, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import './Auth.css';

const ResetPasswordConfirm = () => {
    const { uid, token } = useParams();
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // State untuk menampilkan/menyembunyikan password
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleResetPassword = async (e) => {
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
            const response = await fetch(`http://127.0.0.1:8000/api/login/password-reset-confirm/${uid}/${token}/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ new_password: newPassword }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message);
                setSuccess(true); // Tandai sebagai sukses
            } else {
                setError(data.error || 'Gagal mereset password. Tautan mungkin telah kedaluwarsa.');
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
                <h2>Atur Password Baru</h2>
                
                {/* Tampilkan form jika belum sukses, jika sudah sukses tampilkan pesan */}
                {!success ? (
                    <>
                        <p style={{marginBottom: '20px', fontSize: '0.9em', color: '#666', textAlign: 'center'}}>
                            Silakan masukkan password baru Anda di bawah ini.
                        </p>
                        <form onSubmit={handleResetPassword}>
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
                            
                            {error && (
                                <div className="form-feedback error">
                                    <FiAlertCircle /> {error}
                                </div>
                            )}

                            <button type="submit" className="btn-auth" disabled={loading}>
                                {loading ? 'Menyimpan...' : 'Reset Password'}
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="form-feedback success" style={{padding: '20px', textAlign: 'center'}}>
                        <FiCheckCircle size={40} style={{marginBottom: '15px'}}/>
                        <h3 style={{margin: '0 0 10px 0'}}>Berhasil!</h3>
                        <p>{message}</p>
                        <Link to="/login" className="btn-auth" style={{textDecoration: 'none', marginTop: '20px', display: 'inline-block'}}>
                            Kembali ke Login
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResetPasswordConfirm;