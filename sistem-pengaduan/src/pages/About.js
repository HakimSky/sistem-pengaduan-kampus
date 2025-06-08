// src/pages/About.js
import React from 'react';
import Navbar from '../components/Navbar';
import './About.css'; // Kita akan buat file CSS ini
import { FiFlag, FiEye, FiZap } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const About = () => {
    const navigate = useNavigate();

    return (
        <>
            <Navbar />
            <div className="about-container">
                <div className="about-hero">
                    <h1>Tentang El-Lapor</h1>
                    <p className="motto">"Suara Anda, Solusi Kita Bersama."</p>
                </div>
                <div className="about-content">
                    <h2>Misi Kami</h2>
                    <p>
                        El-Lapor hadir sebagai platform digital untuk menjembatani komunikasi antara seluruh warga kampus dengan pihak manajemen Universitas Muhammadiyah Surakarta (UMS). Kami percaya bahwa lingkungan belajar yang kondusif lahir dari fasilitas yang terawat dan sistem akademik yang responsif. Misi kami adalah mewujudkan ekosistem kampus yang lebih baik melalui sistem pengaduan yang terstruktur, transparan, dan efisien.
                    </p>
                    <div className="features-grid">
                        <div className="feature-card">
                            <FiZap size={40} className="feature-icon" />
                            <h3>Mudah & Cepat</h3>
                            <p>Laporkan masalah fasilitas atau kendala akademik hanya dalam beberapa langkah sederhana melalui antarmuka yang intuitif.</p>
                        </div>
                        <div className="feature-card">
                            <FiEye size={40} className="feature-icon" />
                            <h3>Transparan</h3>
                            <p>Pantau setiap perkembangan laporan Anda secara real-time, mulai dari verifikasi hingga penyelesaian masalah.</p>
                        </div>
                        <div className="feature-card">
                            <FiFlag size={40} className="feature-icon" />
                            <h3>Responsif</h3>
                            <p>Setiap laporan yang masuk akan langsung diteruskan ke pihak berwenang untuk ditindaklanjuti sesegera mungkin.</p>
                        </div>
                    </div>
                    <div className="about-cta">
                        <h3>Punya Keluhan atau Masukan?</h3>
                        <p>Jangan ragu untuk membuat perubahan. Laporkan sekarang juga!</p>
                        <button className="btn-lapor" onClick={() => navigate('/pengaduan')}>
                            Buat Laporan
                        </button>
                    </div>
                </div>
            </div>
            {/* Anda bisa menambahkan footer di sini jika perlu */}
        </>
    );
};

export default About;