import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Import pages
import Home from './pages/Home';
import SchemeChecker from './pages/SchemeChecker';
import ReportVault from './pages/ReportVault';
import ReportAnalysis from './pages/ReportAnalysis';
import Premium from './pages/Premium';
import Login from './pages/Login';
import Register from './pages/Register';
import HospitalDashboard from './pages/HospitalDashboard';
import ProtectedRoute from './pages/ProtectedRoute';

// Import components
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/scheme-checker" element={<SchemeChecker />} />
          <Route path="/report-vault" element={<ProtectedRoute><ReportVault /></ProtectedRoute>} />
          <Route path="/report-analysis" element={<ProtectedRoute><ReportAnalysis /></ProtectedRoute>} />
          <Route path="/premium" element={<ProtectedRoute><Premium /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/hospital-dashboard" element={<ProtectedRoute requiredRole="HOSPITAL_STAFF"><HospitalDashboard /></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;