import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from '../styles/Sidebar.module.css';
import StaffBrand from './StaffBrand';

export default function Sidebar({ open, onClose }) {
  const location = useLocation();

  const role = (sessionStorage.getItem('staffRole') || 'sumc_counsellor').toLowerCase();
  const dashboardHref = role === 'peer_counsellor'
    ? '/staff/peer-dashboard'
    : role === 'dean'
      ? '/staff/dean-dashboard'
      : '/staff/dashboard';

  // Role-based navigation
  const navItems = role === 'dean'
    ? [
        { href: dashboardHref, label: 'Dean Dashboard', icon: 'fas fa-chart-line', badge: null },
      ]
    : [
        { href: dashboardHref, label: 'Dashboard', icon: 'fas fa-tachometer-alt', badge: null },
        { href: '/staff/high-risk-alerts', label: 'High-Risk Alerts', icon: 'fas fa-exclamation-triangle' },
        { href: '/staff/referrals', label: 'Referrals', icon: 'fas fa-user-md', badge: null },
        { href: '/staff/follow-up-notes', label: 'Notes', icon: 'fas fa-sticky-note', badge: null },
      ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className={`${styles.sidebar} ${open ? styles.open : ''}`}>
      <div className={styles.sidebarHeader}>
        <Link to={dashboardHref} className={styles.brand}>
          <StaffBrand compact showLabel={false} align="center" />
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
