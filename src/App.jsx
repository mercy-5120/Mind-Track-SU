import React, { useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ErrorBoundary from "./components/ErrorBoundary";
import LandingPage from "./pages/user/LandingPage";
//Student Pages
import AssessmentIntro from "./pages/student/AssessmentIntro";
import AssessmentQuestions from "./pages/student/AssessmentQuestions";
import AssessmentCompletion from "./pages/student/AssessmentCompletion";
import FeedbackScreen from "./pages/student/FeedbackScreen";
import ResourceDirectory from "./pages/student/ResourceDirectory";
import CrisisPrompt from "./pages/student/CrisisPrompt";

import CreateAccount from "./pages/user/CreateAccount";
import Login from "./pages/user/Login";
import ForgotPassword from "./pages/user/ForgotPassword";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentProfile from "./pages/student/StudentProfile";
import StudentHistory from "./pages/student/StudentHistory";
//STAFF PAGES
import StaffLogin from "./pages/staff/StaffLogin";
import SUMCDashboard from "./pages/staff/SUMC/SUMCDashboard";
import PeerDashboard from "./pages/staff/PeerCounsellors/PeerDashboard";
import DeanDashboard from "./pages/staff/Dean/DeanDashboard";
import HighRiskAlerts from "./pages/staff/PeerCounsellors/HighRiskAlerts";
import Referrals from "./pages/staff/PeerCounsellors/Referrals";
import Resources from "./pages/staff/SUMC/Resources";
import ScheduleSessions from "./pages/staff/SUMC/ScheduleSessions";
import Settings from "./pages/staff/SUMC/Settings";
import AlertDetails from "./pages/staff/SUMC/AlertDetails";
import CreateReferral from "./pages/staff/SUMC/CreateReferral";
import AddResources from "./pages/staff/SUMC/AddResources";
import FollowUpNotes from "./pages/staff/PeerCounsellors/FollowUpNotes";
import "./styles/globals.css";
import PrivacyPolicy from "./pages/user/PrivacyPolicy";
import TermsandConditions from "./pages/user/TermsandConditions";

function App() {
  const location = useLocation();
  const staffRole = typeof window !== "undefined" ? sessionStorage.getItem("staffRole") : null;
  const isStaffRoute = location.pathname.startsWith("/staff");

  const defaultStaffHome = staffRole === "peer_counsellor"
    ? "/staff/peer/dashboard"
    : staffRole === "dean"
      ? "/staff/dean/dashboard"
      : staffRole
        ? "/staff/sumc/dashboard"
        : "/staff/login";

  const resolveRolePath = (sumcPath, peerPath, deanPath = "/staff/dean/dashboard") => {
    if (!staffRole) return "/staff/login";
    if (staffRole === "peer_counsellor") return peerPath;
    if (staffRole === "dean") return deanPath;
    return sumcPath;
  };

  useEffect(() => {
    console.log("[Router] Current route:", location.pathname);
  }, [location.pathname]);

  return (
    <>
      {!isStaffRoute && <Header />}
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/staff/login" element={<StaffLogin />} />

          <Route path="/staff/dashboard" element={<Navigate to={defaultStaffHome} replace />} />
          <Route path="/staff/peer-dashboard" element={<Navigate to="/staff/peer/dashboard" replace />} />
          <Route path="/staff/dean-dashboard" element={<Navigate to="/staff/dean/dashboard" replace />} />
          <Route path="/staff/high-risk-alerts" element={<Navigate to={resolveRolePath("/staff/sumc/high-risk-alerts", "/staff/peer/high-risk-alerts", "/staff/dean/dashboard")} replace />} />
          <Route path="/staff/referrals" element={<Navigate to={resolveRolePath("/staff/sumc/referrals", "/staff/peer/referrals", "/staff/dean/dashboard")} replace />} />
          <Route path="/staff/create-referral" element={<Navigate to="/staff/sumc/create-referral" replace />} />
          <Route path="/staff/resources" element={<Resources role={staffRole} />} />
          <Route path="/staff/add-resources" element={<Navigate to="/staff/sumc/add-resources" replace />} />
          <Route path="/staff/schedule-sessions" element={<Navigate to={resolveRolePath("/staff/sumc/schedule-sessions", "/staff/peer/schedule-sessions", "/staff/dean/dashboard")} replace />} />
          <Route path="/staff/follow-up-notes" element={<Navigate to={resolveRolePath("/staff/sumc/follow-up-notes", "/staff/peer/follow-up-notes", "/staff/dean/dashboard")} replace />} />
          <Route path="/staff/settings" element={<Navigate to={resolveRolePath("/staff/sumc/settings", "/staff/peer/settings", "/staff/dean/dashboard")} replace />} />
          <Route path="/staff/alert-details" element={<Navigate to={resolveRolePath("/staff/sumc/alert-details", "/staff/peer/alert-details", "/staff/dean/dashboard")} replace />} />

          <Route path="/staff/sumc/dashboard" element={<SUMCDashboard />} />
          <Route path="/staff/sumc/high-risk-alerts" element={<HighRiskAlerts role="sumc" />} />
          <Route path="/staff/sumc/referrals" element={<Referrals />} />
          <Route path="/staff/sumc/create-referral" element={<CreateReferral />} />
          <Route path="/staff/sumc/resources" element={<Resources role="sumc" />} />
          <Route path="/staff/sumc/add-resources" element={<AddResources />} />
          <Route path="/staff/sumc/schedule-sessions" element={<ScheduleSessions />} />
          <Route path="/staff/sumc/follow-up-notes" element={<FollowUpNotes />} />
          <Route path="/staff/sumc/settings" element={<Settings role="sumc" />} />
          <Route path="/staff/sumc/alert-details" element={<AlertDetails role="sumc" />} />

          <Route path="/staff/peer/dashboard" element={<PeerDashboard />} />
          <Route path="/staff/peer/high-risk-alerts" element={<HighRiskAlerts role="peer" />} />
          <Route path="/staff/peer/referrals" element={<Referrals />} />
          <Route path="/staff/peer/resources" element={<Resources role="peer" />} />
          <Route path="/staff/peer/schedule-sessions" element={<ScheduleSessions />} />
          <Route path="/staff/peer/follow-up-notes" element={<FollowUpNotes />} />
          <Route path="/staff/peer/settings" element={<Settings role="peer" />} />
          <Route path="/staff/peer/alert-details" element={<AlertDetails role="peer" />} />

          <Route path="/staff/dean/dashboard" element={<DeanDashboard />} />

          <Route path="/assessment-intro" element={<AssessmentIntro />} />
          <Route path="/assessment" element={<AssessmentQuestions />} />
          <Route path="/completion" element={<AssessmentCompletion />} />
          <Route path="/feedback" element={<FeedbackScreen />} />
          <Route path="/resources" element={<ResourceDirectory />} />
          <Route path="/crisis" element={<CrisisPrompt />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/profile" element={<StudentProfile />} />
          <Route path="/student/history" element={<StudentHistory />} />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-and-conditions" element={<TermsandConditions />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ErrorBoundary>
      {!isStaffRoute && <Footer />}
    </>
  );
}

export default App;
