import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layout/MainLayout';

// Page Imports
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PetManagement from './pages/PetManagement';
import VaccinationTracker from './pages/VaccinationTracker';
import AppointmentScheduler from './pages/AppointmentScheduler';
import AdoptionCenter from './pages/AdoptionCenter';
import AdoptionRequests from './pages/AdoptionRequests';
import MedicalRecords from './pages/MedicalRecords';
import UserManagement from './pages/UserManagement';
import Reports from './pages/Reports';

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth routes without MainLayout */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Core application routes wrapped inside MainLayout */}
        <Route
          path="/"
          element={
            <MainLayout>
              <Dashboard />
            </MainLayout>
          }
        />
        <Route
          path="/pets"
          element={
            <MainLayout>
              <PetManagement />
            </MainLayout>
          }
        />
        <Route
          path="/vaccinations"
          element={
            <MainLayout>
              <VaccinationTracker />
            </MainLayout>
          }
        />
        <Route
          path="/medical"
          element={
            <MainLayout>
              <MedicalRecords />
            </MainLayout>
          }
        />
        <Route
          path="/adoptions"
          element={
            <MainLayout>
              <AdoptionCenter />
            </MainLayout>
          }
        />
        <Route
          path="/appointments"
          element={
            <MainLayout>
              <AppointmentScheduler />
            </MainLayout>
          }
        />
        <Route
          path="/users"
          element={
            <MainLayout>
              <UserManagement />
            </MainLayout>
          }
        />
        <Route
          path="/reports"
          element={
            <MainLayout>
              <Reports />
            </MainLayout>
          }
        />
        <Route
          path="/adoption-requests"
          element={
            <MainLayout>
              <AdoptionRequests />
            </MainLayout>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;