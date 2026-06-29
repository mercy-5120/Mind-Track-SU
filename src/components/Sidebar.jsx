import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from '../styles/Sidebar.module.css';

export default function Sidebar({ open, onClose }) {
  const location = useLocation();

  const navItems = [
    { href: '/staff/dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt', badge: null },
    { href: '/staff/high-risk-alerts', label: 'High-Risk Alerts', icon: 'fas fa-exclamation-triangle', badge: '12' },
    { href: '/staff/schedule-sessions', label: 'Schedule Sessions', icon: 'fas fa-calendar-check', badge: null },
    { href: '/staff/referrals', label: 'Referrals', icon: 'fas fa-user-md', badge: null },
    { href: '/staff/resources', label: 'Resources', icon: 'fas fa-book', badge: null },
    { href: '/staff/settings', label: 'Settings', icon: 'fas fa-cog', badge: null },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className={`${styles.sidebar} ${open ? styles.open : ''}`}>
      <div className={styles.sidebarHeader}>
        <Link to="/staff/dashboard" className={styles.brand}>
          <img src="/Logo.png" alt="MindTrackSU Logo" className={styles.logoImg} />
        </Link>
      </div>

      <nav className={styles.nav}>
        <ul>
          {navItems.map((item) => (
            <li key={item.href} className={isActive(item.href) ? 'active' : ''}>
              <Link to={item.href} onClick={onClose}>
                <i className={item.icon}></i>
                {item.label}
                {item.badge && <span className={styles.badge}>{item.badge}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.sidebarFooter}>
        <Link to="/staff/login">
          <i className="fas fa-sign-out-alt"></i>
          Logout
        </Link>
      </div>
    </aside>
  );
}
