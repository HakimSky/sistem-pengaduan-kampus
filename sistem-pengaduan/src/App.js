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
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/profile" element={<Profile />} /> 
        <Route path="/pengaduan" element={<Pengaduan />} /> 
        <Route path="/riwayat" element={<Riwayat />} />
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>}/>
        <Route path="/pihakkampus" element={<DashboardPK />} />
        <Route path="/admin/verifikasi" element={<AdminVerifikasi />} />
        <Route path="/admin/akun" element={<AdminManajemenAkun />} />
      </Routes>
    </Router>
  );
}

export default App;
