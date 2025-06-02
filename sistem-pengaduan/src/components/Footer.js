import React from 'react';
// Jika Anda membuat Footer.css terpisah: import './Footer.css';
// Atau pastikan style dari PihakKampus.css atau App.css sudah mencakup footer.

const Footer = () => {
  return (
    <footer className="footer"> {/* Pastikan class "footer" ada di PihakKampus.css atau CSS global */}
      <div className="footer-content">
        <p className="footer-copy">&copy; {new Date().getFullYear()} EL-Lapor. Semua Hak Dilindungi.</p>
        <p className="footer-links">
          <a href="/kebijakan">Kebijakan Privasi</a> |
          <a href="/bantuan">Bantuan</a> |
          <a href="/kontak">Kontak</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;