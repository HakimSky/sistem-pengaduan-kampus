// src/pages/Contact.js
import React from 'react';
import Navbar from '../components/Navbar';
import './Contact.css'; 
import { FiMapPin, FiMail, FiPhone, FiClock } from 'react-icons/fi';

const Contact = () => {
    return (
        <>
            <Navbar />
            <div className="contact-container">
                <div className="contact-header">
                    <h1>Hubungi Kami</h1>
                    <p>Kami siap membantu. Hubungi kami melalui detail di bawah ini.</p>
                </div>
                <div className="contact-grid">
                    <div className="contact-card map-card">
                        <iframe 
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3955.207375231506!2d110.78198171431664!3d-7.556606194551054!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a1467b2d98d53%3A0x404e8f0a7d09d!2sUniversitas%20Muhammadiyah%20Surakarta!5e0!3m2!1sen!2sid!4v1717876801878!5m2!1sen!2sid"
                            width="100%" 
                            height="450" 
                            style={{ border: 0 }} 
                            allowFullScreen="" 
                            loading="lazy" 
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Lokasi Kampus UMS Tes"
                        ></iframe>
                    </div>
                    {/* Kartu info lainnya tetap sama */}
                    <div className="contact-card info-card">
                        <FiMapPin size={30} className="info-icon" />
                        <h3>Alamat Kampus</h3>
                        <p>Jl. A. Yani, Mendungan, Pabelan, Kec. Kartasura, Kabupaten Sukoharjo, Jawa Tengah 57162</p>
                    </div>
                    <div className="contact-card info-card">
                        <FiMail size={30} className="info-icon" />
                        <h3>Email Resmi</h3>
                        <p>Butuh bantuan atau informasi lebih lanjut? Kirimkan email Anda ke:</p>
                        <a href="mailto:kampus@student.ums.ac.id">kampus@student.ums.ac.id</a>
                    </div>
                    <div className="contact-card info-card">
                        <FiPhone size={30} className="info-icon" />
                        <h3>Telepon</h3>
                        <p>Hubungi layanan administrasi kami pada jam kerja.</p>
                        <a href="tel:0271717417">(0271) 717417</a>
                    </div>
                     <div className="contact-card info-card">
                        <FiClock size={30} className="info-icon" />
                        <h3>Jam Operasional</h3>
                        <p>Senin - Jumat</p>
                        <p><strong>08.00 - 16.00 WIB</strong></p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Contact;