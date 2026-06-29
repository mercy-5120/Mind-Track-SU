import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Header from "./components/Header";
import LandingPage from "./pages/user/LandingPage";
import AssessmentIntro from "./pages/student/AssessmentIntro";
import AssessmentQuestions from "./pages/student/AssessmentQuestions";
import AssessmentCompletion from "./pages/student/AssessmentCompletion";
import FeedbackScreen from "./pages/student/FeedbackScreen";
import ResourceDirectory from "./pages/student/ResourceDirectory";
import CrisisPrompt from "./pages/student/CrisisPrompt";
import CreateAccount from "./pages/user/CreateAccount";
import Login from "./pages/user/Login";
import ForgotPassword from "./pages/user/ForgotPassword";
import StaffLogin from "./src/pages/staff/StaffLogin";
import SUMCDashboard from "./src/pages/staff/SUMCDashboard";
import PeerDashboard from "./src/pages/staff/PeerDashboard";
import HighRiskAlerts from "./src/pages/staff/HighRiskAlerts";
import ScheduleSessions from "./src/pages/staff/ScheduleSessions";
import Referrals from "./src/pages/staff/Referrals";
import Resources from "./src/pages/staff/Resources";
import Settings from "./src/pages/staff/Settings";
import AlertDetails from "./src/pages/staff/AlertDetails";

function App() {
  const location = useLocation();
  const isStaffRoute = location.pathname.startsWith("/staff");

  return (
    <>
      {!isStaffRoute && <Header />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/assessment-intro" element={<AssessmentIntro />} />
        <Route path="/assessment" element={<AssessmentQuestions />} />
        <Route path="/completion" element={<AssessmentCompletion />} />
        <Route path="/feedback" element={<FeedbackScreen />} />
        <Route path="/resources" element={<ResourceDirectory />} />
        <Route path="/crisis" element={<CrisisPrompt />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/staff/login" element={<StaffLogin />} />
        <Route path="/staff/dashboard" element={<SUMCDashboard />} />
        <Route path="/staff/peer-dashboard" element={<PeerDashboard />} />
        <Route path="/staff/high-risk-alerts" element={<HighRiskAlerts />} />
        <Route path="/staff/schedule-sessions" element={<ScheduleSessions />} />
        <Route path="/staff/referrals" element={<Referrals />} />
        <Route path="/staff/resources" element={<Resources />} />
        <Route path="/staff/settings" element={<Settings />} />
        <Route path="/staff/alert-details" element={<AlertDetails />} />
        <Route path="/staff" element={<Navigate to="/staff/dashboard" replace />} />
      </Routes>
    </>
  );
}

export default App;
