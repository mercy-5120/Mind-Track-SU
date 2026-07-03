import React from 'react';
import styles from '../styles/Layout.module.css'; 

export default function DeanLayout({ children, title }) {
  const storedName = sessionStorage.getItem('staffName') || 'Dean';
  const avatarName = storedName.split(' ').slice(0, 2).join(' ');

  return (
    <div className={styles.layoutContainer}>
      <main className={styles.mainContent}>
        <header className={styles.topHeader}>
          <div className={styles.pageTitle}>
            <h1>{title}</h1>
          </div>
          <div className={styles.userProfile}>
            <span className={styles.roleLabel}>Dean</span>
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(avatarName)}&background=2A2A72&color=fff&size=40`}
              alt="Avatar"
            />
          </div>
        </header>

        {children}

        <footer className={styles.footer}>
          <p>&copy; 2026 MindTrackSU – Strathmore University</p>
        </footer>
      </main>
    </div>
  );
}