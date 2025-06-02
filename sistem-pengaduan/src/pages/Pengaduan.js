import React, { useState, useEffect, useRef } from 'react';
import './Pengaduan.css';
import { FiTag, FiFileText, FiFile, FiMapPin, FiArrowLeft, FiUser, FiCalendar, FiCamera, FiXCircle, FiCheckCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar'; // Pastikan path ini benar

const Pengaduan = () => {
  const navigate = useNavigate();

  // State untuk form
  const [kategori, setKategori] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [gambar, setGambar] = useState(null);
  const [lokasi, setLokasi] = useState('');
  const [tanggalKejadian, setTanggalKejadian] = useState('');

  // State untuk pelapor
  const [wargaKampusId, setWargaKampusId] = useState(null);
  const [wargaKampusNama, setWargaKampusNama] = useState('');

  // State untuk fungsionalitas kamera
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState(null); // Hanya untuk menyimpan object MediaStream
  const [capturedImage, setCapturedImage] = useState(null); // Data URL untuk preview dari kamera
  const [imagePreviewUrl, setImagePreviewUrl] = useState(''); // Data URL untuk preview umum

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // --- useEffect Utama ---
  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      alert('Anda harus login terlebih dahulu!');
      navigate('/login');
      return;
    }
    console.log('Fetching data warga kampus untuk user_id:', userId);
    fetch('http://127.0.0.1:8000/api/warga-kampus/warga-kampus/')
      .then(res => res.json())
      .then(data => {
        const userProfile = data.find(item => String(item.user) === String(userId));
        if (userProfile) {
          setWargaKampusId(userProfile.id);
          setWargaKampusNama(userProfile.nama);
        } else {
          console.warn('Profil pengguna tidak ditemukan untuk user_id:', userId);
        }
      })
      .catch(err => console.error('Error fetching warga kampus:', err));
  }, [navigate]);

  // useEffect untuk menangani stream kamera ke elemen video
  useEffect(() => {
    if (showCamera && stream && videoRef.current) {
      console.log('useEffect [showCamera, stream]: Menghubungkan stream ke elemen video.');
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => {
        console.log('useEffect [showCamera, stream]: Metadata video dimuat. Dimensi:', videoRef.current.videoWidth, videoRef.current.videoHeight);
        videoRef.current.play().catch(e => console.error("useEffect [showCamera, stream]: Gagal memutar video:", e));
      };
    }
    // Cleanup function untuk stream jika showCamera false atau stream berubah
    return () => {
      if (!showCamera && stream && videoRef.current && videoRef.current.srcObject) {
        console.log('useEffect [showCamera, stream]: Cleanup - Menghentikan track stream karena showCamera false.');
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null; // Hapus stream dari elemen video
        setStream(null); // Reset state stream juga
      }
    };
  }, [showCamera, stream]); // Hanya bergantung pada showCamera dan stream


  const handleGambarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setGambar(file);
      setCapturedImage(null); // Jika pilih file, hapus captured image dari kamera
      const reader = new FileReader();
      reader.onloadend = () => setImagePreviewUrl(reader.result);
      reader.readAsDataURL(file);
    } else {
      setGambar(null);
      setImagePreviewUrl('');
    }
  };

  const openCamera = async () => {
    console.log('Tombol "Ambil Foto" diklik. Membuka kamera...');
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const streamData = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        console.log('Stream kamera berhasil didapatkan:', streamData);
        setStream(streamData); // Simpan stream ke state
        setShowCamera(true);   // Tampilkan modal kamera
        
        // Reset state gambar sebelumnya
        setGambar(null);
        setImagePreviewUrl('');
        setCapturedImage(null);
        if (document.getElementById('file-input')) {
            document.getElementById('file-input').value = "";
        }

      } catch (err) {
        console.error("Error saat mengakses kamera: ", err.name, err.message, err);
        if (err.name === "NotAllowedError") alert("Anda tidak memberikan izin untuk mengakses kamera.");
        else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") alert("Tidak ada kamera yang ditemukan.");
        else if (err.name === "NotReadableError") alert("Kamera sedang digunakan aplikasi lain atau ada masalah hardware.");
        else alert(`Tidak bisa mengakses kamera: ${err.name}`);
        // Pastikan stream di-cleanup jika gagal
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        setShowCamera(false);
      }
    } else {
      alert("Kamera tidak didukung oleh browser ini.");
    }
  };

  const closeCamera = () => {
    console.log('Menutup kamera...');
    if (stream) {
      console.log('Menghentikan track dari stream aktif.');
      stream.getTracks().forEach(track => track.stop());
    }
    // Membersihkan srcObject juga penting jika elemen video masih ada di DOM tersembunyi
    if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject = null;
    }
    setStream(null);      // Reset state stream
    setShowCamera(false); // Sembunyikan modal
    setCapturedImage(null); // Hapus preview dari kamera
    // JANGAN reset imagePreviewUrl atau gambar di sini, karena bisa jadi user sudah upload file sebelumnya
    // dan hanya ingin menutup modal kamera tanpa jadi mengambil foto.
  };

  const takePhoto = () => {
    console.log('Mencoba mengambil foto...');
    if (!videoRef.current || !canvasRef.current) {
      console.error('Referensi video atau canvas tidak ditemukan.');
      alert('Gagal mengambil foto: Komponen kamera tidak siap.');
      return;
    }
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video.srcObject || !video.srcObject.active || video.videoWidth === 0 || video.videoHeight === 0) {
      console.error('Stream video tidak aktif atau dimensi video 0.');
      alert('Gagal mengambil foto: Stream kamera bermasalah. Coba tutup dan buka lagi kamera.');
      return;
    }
    console.log('Dimensi video untuk canvas:', video.videoWidth, video.videoHeight);
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    console.log('Gambar dari video telah digambar ke canvas.');
    try {
      const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setCapturedImage(imageDataUrl); // Tampilkan preview hasil jepretan
      console.log('Preview foto berhasil dibuat (data URL).');
    } catch (e) {
      console.error('Error membuat data URL dari canvas:', e);
      alert('Gagal memproses gambar dari canvas.');
    }
  };

  const useCapturedPhoto = () => {
    console.log('Menggunakan foto yang telah diambil...');
    if (!capturedImage || !canvasRef.current || canvasRef.current.width === 0 || canvasRef.current.height === 0) {
      console.error('Tidak ada gambar yang diambil atau canvas kosong.');
      alert('Gagal menggunakan foto: Tidak ada gambar yang valid. Silakan ambil ulang.');
      setCapturedImage(null); // Ajak user ambil ulang
      return;
    }
    canvasRef.current.toBlob(blob => {
      if (blob) {
        const imageFile = new File([blob], `kamera-${Date.now()}.jpg`, { type: 'image/jpeg' });
        setGambar(imageFile); // Ini yang akan diupload
        setImagePreviewUrl(capturedImage); // Gunakan data URL dari kamera untuk preview di form utama
        console.log('Foto dari kamera siap diupload:', imageFile);
        closeCamera(); // Tutup modal setelah foto dipilih
      } else {
        console.error('Gagal membuat blob dari canvas.');
        alert("Gagal memproses gambar. Silakan coba lagi.");
      }
    }, 'image/jpeg', 0.9);
  };

  const retakePhoto = () => {
    console.log('Mengambil ulang foto...');
    setCapturedImage(null); // Kembali ke tampilan video feed
  };

  const removePreview = () => {
    setGambar(null);
    setImagePreviewUrl('');
    setCapturedImage(null);
    if (document.getElementById('file-input')) {
      document.getElementById('file-input').value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // ... (validasi form seperti sebelumnya) ...
    if (!wargaKampusId) {
        alert('Gagal mengirim laporan: Data pelapor tidak ditemukan!'); return;
    }
    if (!kategori || !deskripsi || !lokasi || !tanggalKejadian) {
        alert('Harap lengkapi semua field yang wajib diisi.'); return;
    }

    const formData = new FormData();
    formData.append('kategori', kategori);
    formData.append('deskripsi', deskripsi);
    if (gambar) formData.append('gambar', gambar);
    formData.append('lokasi', lokasi);
    formData.append('tanggal_kejadian', tanggalKejadian);
    formData.append('pelapor', wargaKampusId);

    console.log('FormData siap dikirim:', Object.fromEntries(formData));
    try {
      const response = await fetch('http://127.0.0.1:8000/api/pengaduan/pengaduan/', {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        alert('Pengaduan berhasil dikirim!');
        setKategori(''); setDeskripsi(''); setLokasi(''); setTanggalKejadian('');
        removePreview();
      } else {
        const errorData = await response.json().catch(() => ({ detail: "Gagal mengirim pengaduan." }));
        alert(`Gagal mengirim pengaduan: ${errorData.detail || JSON.stringify(errorData)}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan jaringan saat mengirim pengaduan.');
    }
  };

  // --- JSX ---
  return (
    <>
      <Navbar />
      <div className="formulir-container">
        <div className="formulir-box">
          {/* ... Header formulir ... */}
          <div className="formulir-header">
            <button className="btn-back" onClick={() => navigate(-1)}>
              <FiArrowLeft /> Kembali
            </button>
          </div>
          <div className="formulir-header1">
            <h2>Laporan Masalah</h2>
          </div>

          <form onSubmit={handleSubmit}>
            {/* ... Input Pelapor, Kategori, Deskripsi (tidak berubah) ... */}
            <div className="input-icon">
              <FiUser />
              <input type="text" placeholder="Pelapor" value={wargaKampusNama} readOnly />
            </div>
            <div className="input-icon">
              <FiTag />
              <select value={kategori} onChange={(e) => setKategori(e.target.value)} required>
                <option value="">Pilih Kategori</option>
                <option value="Jalan rusak">Jalan rusak</option>
                <option value="Lantai rusak">Lantai rusak</option>
                <option value="Fasilitas umum">Fasilitas umum</option>
                <option value="Sampah">Sampah</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
            <div className="input-icon">
              <FiFileText />
              <textarea placeholder="Deskripsi" value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} required />
            </div>

            {/* --- Bagian Upload Gambar & Ambil Foto --- */}
            {!showCamera && (
              <div className="input-group-gambar">
                <label htmlFor="file-input" className="file-input-container input-icon">
                  <FiFile />
                  <input
                    id="file-input"
                    type="file"
                    accept="image/*"
                    onChange={handleGambarChange}
                    style={{ display: 'none' }}
                  />
                  <span>{gambar && !capturedImage && gambar.name ? (gambar.name.length > 20 ? gambar.name.substring(0,17)+'...' : gambar.name) : 'Pilih file...'}</span>
                </label>
                <button type="button" className="btn-camera" onClick={openCamera}>
                  <FiCamera /> Ambil Foto
                </button>
              </div>
            )}
            
            {imagePreviewUrl && !showCamera && (
              <div className="image-preview-container">
                <p>Pratinjau:</p>
                <img src={imagePreviewUrl} alt="Pratinjau" className="image-preview" />
                <button type="button" onClick={removePreview} className="btn-remove-preview">
                  <FiXCircle /> Hapus
                </button>
              </div>
            )}

            {/* --- Modal Kamera --- */}
            {showCamera && (
              <div className="camera-modal">
                <div className="camera-view">
                  <video ref={videoRef} playsInline muted className="camera-feed" style={{ display: capturedImage ? 'none' : 'block' }}></video>
                  {capturedImage && <img src={capturedImage} alt="Captured Preview" className="camera-feed" />}
                  
                  <div className="camera-controls">
                    {!capturedImage ? (
                      <button type="button" onClick={takePhoto} className="btn-capture">
                        <FiCamera /> Ambil Gambar
                      </button>
                    ) : (
                      <>
                        <button type="button" onClick={useCapturedPhoto} className="btn-use-photo">
                          <FiCheckCircle /> Gunakan
                        </button>
                        <button type="button" onClick={retakePhoto} className="btn-retake">
                          Ulangi
                        </button>
                      </>
                    )}
                    <button type="button" onClick={closeCamera} className="btn-close-camera-inline">
                      <FiXCircle /> {!capturedImage ? 'Tutup' : 'Batal'}
                    </button>
                  </div>
                  {/* Canvas selalu ada tapi disembunyikan, hanya untuk proses internal */}
                  <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
                </div>
              </div>
            )}

            {/* ... Input Lokasi, Tanggal (tidak berubah) ... */}
            <div className="input-icon">
              <FiMapPin />
              <input type="text" placeholder="Lokasi" value={lokasi} onChange={(e) => setLokasi(e.target.value)} required />
            </div>
            <div className="input-icon">
              <FiCalendar />
              <input type="date" value={tanggalKejadian} onChange={(e) => setTanggalKejadian(e.target.value)} required />
            </div>

            <button className="btn-submit" type="submit" disabled={showCamera}>
              Kirim Laporan
            </button>
          </form>
        </div>
      </div>
      {/* ... Footer (tidak berubah) ... */}
      <footer className="footer">
        <div className="footer-content">
          <p className="footer-copy">&copy; 2025 El-Lapor. Semua Hak Dilindungi.</p>
          <p className="footer-links">
            <a href="/kebijakan">Kebijakan Privasi</a> | <a href="/bantuan">Bantuan</a> | <a href="/kontak">Kontak</a>
          </p>
        </div>
      </footer>
    </>
  );
};

export default Pengaduan;