import React, { useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Header from "./src/components/Header";
import Footer from "./src/components/Footer";
import ErrorBoundary from "./src/components/ErrorBoundary";
import AssessmentLayout from "./src/components/AssessmentLayout";
import StudentLayout from "./src/components/StudentLayout";
import LandingPage from "./src/pages/user/LandingPage";
//Student Pages
import AssessmentIntro from "./src/pages/student/AssessmentIntro";
import AssessmentQuestions from "./src/pages/student/AssessmentQuestions";
import AssessmentCompletion from "./src/pages/student/AssessmentCompletion";
import FeedbackScreen from "./src/pages/student/FeedbackScreen";
import ResourceDirectory from "./src/pages/student/ResourceDirectory";
import CrisisPrompt from "./src/pages/student/CrisisPrompt";

import CreateAccount from "./src/pages/user/CreateAccount";
import Login from "./src/pages/user/Login";
import ForgotPassword from "./src/pages/user/ForgotPassword";
import StudentDashboard from "./src/pages/student/StudentDashboard";
import StudentProfile from "./src/pages/student/StudentProfile";
import StudentHistory from "./src/pages/student/StudentHistory";
//STAFF PAGES
import StaffLogin from "./src/pages/staff/StaffLogin";
import SUMCDashboard from "./src/pages/staff/SUMC/SUMCDashboard";
import PeerDashboard from "./src/pages/staff/PeerCounsellors/PeerDashboard";
import DeanDashboard from "./src/pages/staff/Dean/DeanDashboard";
import HighRiskAlerts from "./src/pages/staff/PeerCounsellors/HighRiskAlerts";
import Referrals from "./src/pages/staff/PeerCounsellors/Referrals";
// REMOVED: import Resources from "./src/pages/staff/SUMC/Resources";
import ScheduleSessions from "./src/pages/staff/SUMC/ScheduleSessions";
import Settings from "./src/pages/staff/SUMC/Settings";
import AlertDetails from "./src/pages/staff/SUMC/AlertDetails";
import CreateReferral from "./src/pages/staff/SUMC/CreateReferral";
import AddResources from "./src/pages/staff/SUMC/AddResources"; // ✅ KEEP THIS
import FollowUpNotes from "./src/pages/staff/PeerCounsellors/FollowUpNotes";
import "./src/styles/globals.css";
import PrivacyPolicy from "./src/pages/user/PrivacyPolicy";
import TermsandConditions from "./src/pages/user/TermsandConditions";

function App() {
  const location = useLocation();
  const staffRole =
    typeof window !== "undefined" ? sessionStorage.getItem("staffRole") : null;

  const isStaffRoute = location.pathname.startsWith("/staff");
  const isStudentRoute = location.pathname.startsWith("/student");

  const isAssessmentRoute =
    location.pathname.startsWith("/assessment") ||
    location.pathname.startsWith("/feedback") ||
    location.pathname.startsWith("/completion") ||
    location.pathname.startsWith("/crisis") ||
    location.pathname.startsWith("/resources");

  const hideHeaderFooter = isStaffRoute || isStudentRoute || isAssessmentRoute;

  const defaultStaffHome =
    staffRole === "peer_counsellor"
      ? "/staff/peer/dashboard"
      : staffRole === "dean"
        ? "/staff/dean/dashboard"
        : staffRole
          ? "/staff/sumc/dashboard"
          : "/staff/login";

  const resolveRolePath = (
    sumcPath,
    peerPath,
    deanPath = "/staff/dean/dashboard",
  ) => {
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
      {!hideHeaderFooter && <Header />}

      <ErrorBoundary>
        <Routes>
          {/* Public Routes - No Layout */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/staff/login" element={<StaffLogin />} />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route
            path="/terms-and-conditions"
            element={<TermsandConditions />}
          />

          {/* Assessment Routes - Using AssessmentLayout */}
          <Route path="/assessment-intro" element={<AssessmentIntro />} />
          <Route path="/assessment" element={<AssessmentQuestions />} />
          <Route path="/completion" element={<AssessmentCompletion />} />
          <Route path="/feedback" element={<FeedbackScreen />} />
          <Route path="/resources" element={<ResourceDirectory />} />
          <Route path="/crisis" element={<CrisisPrompt />} />

          {/* Staff Routes */}
          <Route
            path="/staff/dashboard"
            element={<Navigate to={defaultStaffHome} replace />}
          />
          <Route
            path="/staff/peer-dashboard"
            element={<Navigate to="/staff/peer/dashboard" replace />}
          />
          <Route
            path="/staff/dean-dashboard"
            element={<Navigate to="/staff/dean/dashboard" replace />}
          />
          <Route
            path="/staff/high-risk-alerts"
            element={
              <Navigate
                to={resolveRolePath(
                  "/staff/sumc/high-risk-alerts",
                  "/staff/peer/high-risk-alerts",
                  "/staff/dean/dashboard",
                )}
                replace
              />
            }
          />
          <Route
            path="/staff/referrals"
            element={
              <Navigate
                to={resolveRolePath(
                  "/staff/sumc/referrals",
                  "/staff/peer/referrals",
                  "/staff/dean/dashboard",
                )}
                replace
              />
            }
          />
          <Route
            path="/staff/create-referral"
            element={<Navigate to="/staff/sumc/create-referral" replace />}
          />
          {/* REMOVED: /staff/resources route */}
          <Route
            path="/staff/schedule-sessions"
            element={
              <Navigate
                to={resolveRolePath(
                  "/staff/sumc/schedule-sessions",
                  "/staff/peer/schedule-sessions",
                  "/staff/dean/dashboard",
                )}
                replace
              />
            }
          />
          <Route
            path="/staff/follow-up-notes"
            element={
              <Navigate
                to={resolveRolePath(
                  "/staff/sumc/follow-up-notes",
                  "/staff/peer/follow-up-notes",
                  "/staff/dean/dashboard",
                )}
                replace
              />
            }
          />
          <Route
            path="/staff/settings"
            element={
              <Navigate
                to={resolveRolePath(
                  "/staff/sumc/settings",
                  "/staff/peer/settings",
                  "/staff/dean/dashboard",
                )}
                replace
              />
            }
          />
          <Route
            path="/staff/alert-details"
            element={
              <Navigate
                to={resolveRolePath(
                  "/staff/sumc/alert-details",
                  "/staff/peer/alert-details",
                  "/staff/dean/dashboard",
                )}
                replace
              />
            }
          />

          {/* SUMC Routes */}
          <Route path="/staff/sumc/dashboard" element={<SUMCDashboard />} />
          <Route
            path="/staff/sumc/high-risk-alerts"
            element={<HighRiskAlerts role="sumc" />}
          />
          <Route path="/staff/sumc/referrals" element={<Referrals />} />
          <Route
            path="/staff/sumc/create-referral"
            element={<CreateReferral />}
          />
          <Route
            path="/staff/sumc/add-resources"
            element={<AddResources />} // ✅ KEEP THIS
          />
          <Route
            path="/staff/sumc/schedule-sessions"
            element={<ScheduleSessions />}
          />
          <Route
            path="/staff/sumc/follow-up-notes"
            element={<FollowUpNotes />}
          />
          <Route
            path="/staff/sumc/settings"
            element={<Settings role="sumc" />}
          />
          <Route path="/staff/sumc/alert-details" element={<AlertDetails />} />

          {/* Peer Routes */}
          <Route path="/staff/peer/dashboard" element={<PeerDashboard />} />
          <Route
            path="/staff/peer/high-risk-alerts"
            element={<HighRiskAlerts role="peer" />}
          />
          <Route path="/staff/peer/referrals" element={<Referrals />} />
          <Route
            path="/staff/peer/schedule-sessions"
            element={<ScheduleSessions />}
          />
          <Route
            path="/staff/peer/follow-up-notes"
            element={<FollowUpNotes />}
          />
          <Route
            path="/staff/peer/settings"
            element={<Settings role="peer" />}
          />
          <Route path="/staff/peer/alert-details" element={<AlertDetails />} />

          {/* Dean Routes */}
          <Route path="/staff/dean/dashboard" element={<DeanDashboard />} />

          {/* Student Routes - Using StudentLayout */}
          <Route
            path="/student/dashboard"
            element={
              <StudentLayout>
                <StudentDashboard />
              </StudentLayout>
            }
          />
          <Route
            path="/student/profile"
            element={
              <StudentLayout>
                <StudentProfile />
              </StudentLayout>
            }
          />
          <Route
            path="/student/history"
            element={
              <StudentLayout>
                <StudentHistory />
              </StudentLayout>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ErrorBoundary>

      {!hideHeaderFooter && <Footer />}
    </>
  );
}

export default App;
