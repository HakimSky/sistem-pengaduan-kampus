import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Notifications from './pages/Notifications';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Pengaduan from './pages/Pengaduan';
import Riwayat from './pages/Riwayat';
import AdminDashboard from './pages/AdminDashboard';
import DashboardPK from './pages/DashboardPK';
import ProtectedRoute from './components/ProtectedRoute';
import AdminVerifikasi from './pages/AdminVerifikasi';
import AdminManajemenAkun from './pages/AdminManajemenAkun';
import About from './pages/About';
import Contact from './pages/Contact';
import './App.css';

// --- IMPORT HALAMAN PASSWORD ---
import ChangePassword from './pages/ChangePassword';
import ForgotPassword from './pages/ForgotPassword';
import ResetPasswordConfirm from './pages/ResetPasswordConfirm';

// --- LANGKAH 1: IMPORT PROVIDER ---
import { NotificationProvider } from './context/NotificationContext';

function App() {
  return (
    // --- LANGKAH 2: BUNGKUS SELURUH <Router> DENGAN <NotificationProvider> ---
    <NotificationProvider>
      <Router>
        <Routes>
          {/* Semua rute Anda yang sudah ada tetap di sini, tidak ada yang berubah */}
          
          {/* Rute Publik */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:uid/:token" element={<ResetPasswordConfirm />} />

          {/* Rute yang Dilindungi (Contoh) */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/pengaduan" element={<Pengaduan />} />
          <Route path="/riwayat" element={<Riwayat />} />
          <Route path="/change-password" element={
            <ProtectedRoute>
              <ChangePassword />
            </ProtectedRoute>
          } />

          {/* Rute Pihak Kampus */}
          <Route path="/pihakkampus/*" element={<DashboardPK />} />

          {/* Rute Admin */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }/>
          <Route path="/admin/verifikasi" element={
            <ProtectedRoute>
              <AdminVerifikasi />
            </ProtectedRoute>
          }/>
          <Route path="/admin/akun" element={
            <ProtectedRoute>
              <AdminManajemenAkun />
            </ProtectedRoute>
          }/>
        </Routes>
      </Router>
    </NotificationProvider> // --- AKHIR BUNGKUSAN PROVIDER ---
  );
}

export default App;