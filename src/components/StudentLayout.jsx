import React, { useState } from 'react';
import StudentSidebar from './StudentSidebar';
import styles from '../styles/StudentLayout.module.css';

export default function StudentLayout({ children, title }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => setSidebarOpen(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className={styles.layoutContainer}>
      <StudentSidebar open={sidebarOpen} onClose={closeSidebar} />

      <main className={styles.mainContent}>
        <header className={styles.topHeader}>
          <button className={styles.hamburger} onClick={toggleSidebar}>
            <i className="fas fa-bars"></i>
          </button>
          <div className={styles.pageTitle}>
            <h1>{title}</h1>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}
