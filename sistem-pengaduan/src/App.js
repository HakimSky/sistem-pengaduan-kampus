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

// --- IMPORT HALAMAN BARU ---
import ChangePassword from './pages/ChangePassword'; // Untuk ubah password saat login
import ForgotPassword from './pages/ForgotPassword'; // Halaman lupa password
import ResetPasswordConfirm from './pages/ResetPasswordConfirm'; // Halaman setelah klik link di email

function App() {
  return (
    <Router>
      <Routes>
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
          // Idealnya, halaman ini juga diproteksi
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
  );
}

export default App;
