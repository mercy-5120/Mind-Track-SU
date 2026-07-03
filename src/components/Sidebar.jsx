import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from '../styles/Sidebar.module.css';
import StaffBrand from './StaffBrand';

export default function Sidebar({ open, onClose }) {
  const location = useLocation();
  const role = (sessionStorage.getItem('staffRole') || 'sumc_counsellor').toLowerCase();

  const dashboardHref = role === 'peer_counsellor'
    ? '/staff/peer/dashboard'
    : role === 'dean'
      ? '/staff/dean/dashboard'
      : '/staff/sumc/dashboard';

  const navItems = role === 'dean'
    ? [
        { href: '/staff/dean/dashboard', label: 'Dean Dashboard', icon: 'fas fa-chart-line' },
      ]
    : role === 'peer_counsellor'
      ? [
        { href: '/staff/peer/dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt' },
        { href: '/staff/peer/referrals', label: 'Referrals', icon: 'fas fa-user-md' },
        { href: '/staff/peer/resources', label: 'Resources', icon: 'fas fa-book' },
        { href: '/staff/peer/schedule-sessions', label: 'Schedule Sessions', icon: 'fas fa-calendar-check' },
        { href: '/staff/peer/follow-up-notes', label: 'Follow-Up Notes', icon: 'fas fa-sticky-note' },
        { href: '/staff/peer/settings', label: 'Settings', icon: 'fas fa-cog' },
      ]
      : [
        { href: '/staff/sumc/dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt' },
        { href: '/staff/sumc/high-risk-alerts', label: 'High-Risk Alerts', icon: 'fas fa-exclamation-triangle' },
        { href: '/staff/sumc/create-referral', label: 'Create Referral', icon: 'fas fa-plus' },
        { href: '/staff/sumc/referrals', label: 'Referrals', icon: 'fas fa-user-md' },
        { href: '/staff/sumc/schedule-sessions', label: 'Schedule Sessions', icon: 'fas fa-calendar-check' },
        { href: '/staff/sumc/resources', label: 'Resources', icon: 'fas fa-book' },
        { href: '/staff/sumc/add-resources', label: 'Add Resources', icon: 'fas fa-book-medical' },
        { href: '/staff/sumc/follow-up-notes', label: 'Follow-Up Notes', icon: 'fas fa-sticky-note' },
        { href: '/staff/sumc/settings', label: 'Settings', icon: 'fas fa-cog' },
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
