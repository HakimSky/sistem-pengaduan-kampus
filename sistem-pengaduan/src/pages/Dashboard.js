import React, {useEffect}from 'react';
import Navbar from '../components/Navbar';
import './Dashboard.css';
import { useNavigate , useLocation } from 'react-router-dom';
import chartImg from '../assets/Image/chart.png';
import riwayatImg from '../assets/Image/Dashboard/Riwayat.png';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Cek apakah ada perintah scrollTo dari halaman sebelumnya
    if (location.state?.scrollTo) {
      const targetId = location.state.scrollTo;
      const section = document.getElementById(targetId);
      if (section) {
        // Delay kecil agar elemen sempat dirender sebelum scroll
        setTimeout(() => {
          section.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]);
  return (
    <>
      <Navbar />
      <div className="dashboard" id="home">
        {/* Section Home */}
        <section className="card welcome" id="pengaduan">
          <div className="text">
            <h3>Halo, Selamat Datang</h3>
            <p>Temukan solusi untuk </p>
            <p>setiap keluhan akademikmu.</p>
            <p className="subtext">Laporkan masalahmu dengan mudah dan transparan</p>
            <a button className="btn" onClick={() => navigate('/pengaduan')}>
              Lapor
            </a>
          </div>
          <img 
          className='Icon-image'
          src={chartImg} alt="Chart" />
        </section>

        {/* Section Riwayat */}
        <section className="card riwayat" id="riwayat">
          <div className="text">
            <h3>Riwayat Pengaduan</h3>
            <p>Lacak status aduanmu di sini</p>
            <p>Pastikan setiap permasalahan</p>
            <p>terselesaikan dengan baik.</p>
            <p className="subtext">Tetaplah terinformasi dengan perkembangan setiap pengaduanmu</p>
            <a button className="btn" onClick={() => navigate('/riwayat')}>
              Riwayat
            </a>
          </div>
          <img 
          className='Icon-image'
          src={riwayatImg} alt="tracking" 
          />
        </section>

        {/* Section About */}
        <section className="card about" id="about">
          <div className="text">
            <h3>About</h3>
            <p>Sistem Pengaduan yang</p>
            <p>dirancang untuk memudahkan</p>
            <p>dalam laporkan masalah</p>
            <p>akademik dan fasilitas kampus</p>
            <p className="subtext">Komitmen untuk memberikan layanan yang cepat,transparan, dan responsif</p>
            <a button className="btn" onClick={() => navigate('/about')}>
                    Selengkapnya
                </a>
          </div>
        </section>

        {/* Section Contact */}
        <section className="card contact" id="contact">
          <div className="text">
            <h3>Contact</h3>
            <p1>
              Untuk pertanyaan lebih lanjut, silakan hubungi kami melalui:
              <br />📧 Email: kampus@student.ums.ac.id
              <br />📞 Telp: (0271) 123456
              <br />🕘 Jam Operasional: Senin - Jumat (08.00 - 16.00 WIB)
            </p1>
            <p>
              <a button className="btn" onClick={() => navigate('/contact')}>
                    Info Kontak
              </a>
            </p>
          </div>
        </section>
      </div>
    {/* Footer */}
    <footer className="footer">
      <div className="footer-content">
        <p className="footer-copy">© {new Date().getFullYear()} El-Lapor. All rights reserved.</p>
        <p className="footer-links">
          <a href="/kebijakan">Kebijakan Privasi</a> |
          <a href="/bantuan">Bantuan</a> |
          <a href="/kontak">Kontak</a>
        </p>
      </div>
    </footer>
    </>
  );
};

export default Dashboard;
