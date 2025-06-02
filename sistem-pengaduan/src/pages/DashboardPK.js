// src/pages/pihakKampus/DashboardPK.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PihakKampusLayout from './PihakKampusLayout'; // <-- PERLU DIIMPOR
import PengaduanKampus from './PengaduanKampus';
import DataDiriKampus from './DataDiriKampus';

const DashboardPK = () => {
  return (
    <Routes>
      <Route path="/" element={<PihakKampusLayout />}> {/* PihakKampusLayout membungkus rute anak */}
        <Route index element={<Navigate to="pengaduan" replace />} />
        <Route path="pengaduan" element={<PengaduanKampus />} />
        <Route path="profil" element={<DataDiriKampus />} />
        <Route path="*" element={<Navigate to="pengaduan" replace />} /> {/* Fallback internal */}
      </Route>
    </Routes>
  );
};
export default DashboardPK;