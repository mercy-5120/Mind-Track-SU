import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
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
import "./styles/globals.css";

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
      </Routes>
      {!isStaffRoute && <Footer />}
    </>
  );
}

export default App;
