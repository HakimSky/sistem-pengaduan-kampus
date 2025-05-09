import React from 'react';
import Navbar from '../components/Navbar';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <>
      <Navbar />
      <div className="dashboard" id="home">
        {/* Section Home */}
        <section className="card welcome">
          <div className="text">
            <h3>Halo, Selamat Datang</h3>
            <p>Temukan solusi untuk setiap keluhan akademikmu.</p>
            <p className="subtext">Laporkan masalahmu dengan mudah dan transparan</p>
            <a className="btn" href="/form">Lapor</a>
          </div>
          <img src="/assets/chart.png" alt="grafik" />
        </section>

        {/* Section Riwayat */}
        <section className="card riwayat" id="riwayat">
          <div className="text">
            <h4>Riwayat Pengaduan</h4>
            <p>Lacak status aduanmu di sini. Pastikan setiap permasalahan terselesaikan dengan baik.</p>
            <a className="btn" href="/riwayat">Riwayat</a>
          </div>
          <img src="/assets/tracking.png" alt="tracking" />
        </section>

        {/* Section About */}
        <section className="card about" id="about">
          <div className="text">
            <h4>Tentang El-Lapor</h4>
            <p>
              El-Lapor adalah sistem pengaduan kampus berbasis digital yang dirancang untuk mempermudah mahasiswa dalam menyampaikan keluhan akademik maupun fasilitas kampus. Sistem ini dibuat untuk mendorong keterbukaan, kecepatan, dan transparansi dalam penyelesaian masalah.
            </p>
          </div>
        </section>

        {/* Section Contact */}
        <section className="card contact" id="contact">
          <div className="text">
            <h4>Kontak Kami</h4>
            <p>
              Untuk pertanyaan lebih lanjut, silakan hubungi kami melalui:
              <br />📧 Email: help@kampus.ac.id
              <br />📞 Telp: (0271) 123456
              <br />🕘 Jam Operasional: Senin - Jumat (08.00 - 16.00 WIB)
            </p>
          </div>
        </section>
      </div>
    </>
  );
};

export default Dashboard;
