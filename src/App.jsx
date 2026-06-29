import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import StaffLogin from './pages/staff/StaffLogin';
import SUMCDashboard from './pages/staff/SUMCDashboard';
import PeerDashboard from './pages/staff/PeerDashboard';
import HighRiskAlerts from './pages/staff/HighRiskAlerts';
import ScheduleSessions from './pages/staff/ScheduleSessions';
import Referrals from './pages/staff/Referrals';
import Resources from './pages/staff/Resources';
import Settings from './pages/staff/Settings';
import AlertDetails from './pages/staff/AlertDetails';
import './styles/global.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Staff Routes */}
        <Route path="/staff/login" element={<StaffLogin />} />
        <Route path="/staff/dashboard" element={<SUMCDashboard />} />
        <Route path="/staff/peer-dashboard" element={<PeerDashboard />} />
        <Route path="/staff/high-risk-alerts" element={<HighRiskAlerts />} />
        <Route path="/staff/schedule-sessions" element={<ScheduleSessions />} />
        <Route path="/staff/referrals" element={<Referrals />} />
        <Route path="/staff/resources" element={<Resources />} />
        <Route path="/staff/settings" element={<Settings />} />
        <Route path="/staff/alert-details" element={<AlertDetails />} />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/staff/dashboard" replace />} />
        <Route path="/staff" element={<Navigate to="/staff/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
