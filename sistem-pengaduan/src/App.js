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
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/pihakkampus" element={<DashboardPK />} />
      </Routes>
    </Router>
  );
}

export default App;
