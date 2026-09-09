import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layout/MainLayout';

// Pages
import Dashboard from './pages/Dashboard';
import PetManagement from './pages/PetManagement';
import VaccinationTracker from './pages/VaccinationTracker';
import MedicalRecords from './pages/MedicalRecords';
import AdoptionCenter from './pages/AdoptionCenter';
import AppointmentScheduler from './pages/AppointmentScheduler';
import UserManagement from './pages/UserManagement';
import Reports from './pages/Reports';
import AdoptionRequests from './pages/AdoptionRequests';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Authentication Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected / App Layout Pages */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="pets" element={<PetManagement />} />
          <Route path="vaccinations" element={<VaccinationTracker />} />
          <Route path="medical-records" element={<MedicalRecords />} />
          <Route path="adoption-center" element={<AdoptionCenter />} />
          <Route path="appointments" element={<AppointmentScheduler />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="reports" element={<Reports />} />
          <Route path="adoption-requests" element={<AdoptionRequests />} />
        </Route>

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;