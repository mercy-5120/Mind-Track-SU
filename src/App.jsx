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
import "./styles/globals.css";

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
          <Route path="/assessment-intro" element={<AssessmentIntro />} />
          <Route path="/assessment" element={<AssessmentQuestions />} />
          <Route path="/completion" element={<AssessmentCompletion />} />
          <Route path="/feedback" element={<FeedbackScreen />} />
          <Route path="/resources" element={<ResourceDirectory />} />
          <Route path="/crisis" element={<CrisisPrompt />} />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ErrorBoundary>
      {!isStaffRoute && <Footer />}
    </>
  );
}

export default App;
