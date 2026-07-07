// src/components/AssessmentLayout.jsx
import React, { useState } from "react";
import { isStudentLoggedIn } from "../utils/studentSession";
import StudentSidebar from "./StudentSidebar";
import styles from "../styles/AssessmentLayout.module.css";

export default function AssessmentLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isLoggedIn = isStudentLoggedIn();

  const closeSidebar = () => setSidebarOpen(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // If NOT logged in, render without sidebar (anonymous mode) - CENTERED
  if (!isLoggedIn) {
    return (
      <div className={styles.anonymousContainer}>
        <main className={styles.anonymousMainContent}>
          <div className={styles.anonymousContentWrapper}>{children}</div>
        </main>
      </div>
    );
  }

  // If logged in, render with sidebar (student mode) - LEFT ALIGNED
  return (
    <div className={styles.studentContainer}>
      <StudentSidebar open={sidebarOpen} onClose={closeSidebar} />
      <main className={styles.studentMainContent}>
        <header className={styles.topHeader}>
          <button className={styles.hamburger} onClick={toggleSidebar}>
            <i className="fas fa-bars"></i>
          </button>
        </header>
        {children}
      </main>
    </div>
  );
}
