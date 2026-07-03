import React, { useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ErrorBoundary from "./components/ErrorBoundary";
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
import StaffLogin from "./pages/staff/StaffLogin";
import SUMCDashboard from "./pages/staff/SUMCDashboard";
import PeerDashboard from "./pages/staff/PeerDashboard";
import DeanDashboard from "./pages/staff/DeanDashboard";
import HighRiskAlerts from "./pages/staff/HighRiskAlerts";
import Referrals from "./pages/staff/PeerCounsellors/Referrals";
import Resources from "./pages/staff/Resources";
import ScheduleSessions from "./pages/staff/ScheduleSessions";
import Settings from "./pages/staff/Settings";
import AlertDetails from "./pages/staff/AlertDetails";
import CreateReferral from "./pages/staff/CreateReferral";
import AddResources from "./pages/staff/AddResources";
import FollowUpNotes from "./pages/staff/FollowUpNotes";
import "./styles/globals.css";
import PrivacyPolicy from "./pages/user/PrivacyPolicy";
import TermsandConditions from "./pages/user/TermsandConditions";

function App() {
  const location = useLocation();
  const isStaffRoute = location.pathname.startsWith("/staff");

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
          <Route path="/staff/dashboard" element={<SUMCDashboard />} />
          <Route path="/staff/peer-dashboard" element={<PeerDashboard />} />
          <Route path="/staff/dean-dashboard" element={<DeanDashboard />} />
          <Route path="/staff/high-risk-alerts" element={<HighRiskAlerts />} />
          <Route path="/staff/referrals" element={<Referrals />} />
          <Route path="/staff/create-referral" element={<CreateReferral />} />
          <Route path="/staff/resources" element={<Resources />} />
          <Route path="/staff/add-resources" element={<AddResources />} />
          <Route
            path="/staff/schedule-sessions"
            element={<ScheduleSessions />}
          />
          <Route path="/staff/follow-up-notes" element={<FollowUpNotes />} />
          <Route path="/staff/settings" element={<Settings />} />
          <Route path="/staff/alert-details" element={<AlertDetails />} />
          <Route path="/assessment-intro" element={<AssessmentIntro />} />
          <Route path="/assessment" element={<AssessmentQuestions />} />
          <Route path="/completion" element={<AssessmentCompletion />} />
          <Route path="/feedback" element={<FeedbackScreen />} />
          <Route path="/resources" element={<ResourceDirectory />} />
          <Route path="/crisis" element={<CrisisPrompt />} />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route
            path="/terms-and-conditions"
            element={<TermsandConditions />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ErrorBoundary>
      {!isStaffRoute && <Footer />}
    </>
  );
}

export default App;
