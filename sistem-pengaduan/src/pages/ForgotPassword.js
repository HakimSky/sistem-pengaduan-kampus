import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// Pastikan path ke Auth.css benar sesuai struktur folder Anda
import './Auth.css'; 

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // State untuk loading

    const handleRequestReset = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);

        try {
            // PASTIKAN URL INI BENAR DAN LENGKAP
            const response = await fetch('http://127.0.0.1:8000/api/login/password-reset-request/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            // Kita tidak perlu langsung .json() jika response mungkin bukan JSON (misal error 500)
            const data = await response.json();

            if (response.ok) {
                setMessage(data.message || 'Instruksi reset telah dikirim.');
            } else {
                setError(data.error || 'Gagal meminta reset password.');
            }
        } catch (err) {
             setError('Terjadi kesalahan pada jaringan atau server. Pastikan server backend berjalan.');
            console.error('Error requesting password reset:', err);
        } finally {
            setLoading(false); // Hentikan loading
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-box" style={{ margin: 'auto' }}>
                <h2>Lupa Password</h2>
                <p style={{marginBottom: '20px', fontSize: '0.9em', color: '#666'}}>
                    Masukkan alamat email Anda. Kami akan mengirimkan tautan untuk mereset password Anda.
                </p>
                <form onSubmit={handleRequestReset}>
                    <div className="input-icon">
                        <input
                            type="email"
                            placeholder="Alamat Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    
                    {message && <p style={{ color: 'green', marginTop: '15px' }}>{message}</p>}
                    {error && <p style={{ color: 'red', marginTop: '15px' }}>{error}</p>}

                    <button type="submit" className="btn-auth" disabled={loading}>
                        {loading ? 'Mengirim...' : 'Kirim Tautan Reset'}
                    </button>
                    
                    <p style={{ marginTop: '20px' }}>
                        <Link to="/login">Kembali ke Login</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
