import React, { useState } from 'react';
import Sidebar from './Sidebar';
import styles from '../styles/Layout.module.css';

export default function Layout({ children, title, role = 'SUMC Counsellor' }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => setSidebarOpen(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const storedName = sessionStorage.getItem('staffName') || 'Staff Member';
  const avatarName = storedName.split(' ').slice(0, 2).join(' ');

  return (
    <div className={styles.layoutContainer}>
      <Sidebar open={sidebarOpen} onClose={closeSidebar} />

      <main className={styles.mainContent}>
        <header className={styles.topHeader}>
          <button className={styles.hamburger} onClick={toggleSidebar}>
            <i className="fas fa-bars"></i>
          </button>
          <div className={styles.pageTitle}>
            <h1>{title}</h1>
          </div>
          <div className={styles.userProfile}>
            <span className={styles.roleLabel}>{role}</span>
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(avatarName)}&background=2A2A72&color=fff&size=40`}
              alt="Avatar"
            />
          </div>
        </header>

        {children}

        <footer>
          <p>&copy; 2026 MindTrackSU – Strathmore University</p>
        </footer>
      </main>
    </div>
  );
}
