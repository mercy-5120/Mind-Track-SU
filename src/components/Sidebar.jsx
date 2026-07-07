import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from '../styles/Sidebar.module.css';
import StaffBrand from './StaffBrand';

export default function Sidebar({ open, onClose }) {
  const location = useLocation();
  
  // Get and normalize the role
  const role = sessionStorage.getItem('staffRole') || 'sumc_counsellor';
  const normalizedRole = role.toLowerCase().trim();
  
  // DEBUG: Log the role to see what's actually stored
  console.log('Raw role from sessionStorage:', role);
  console.log('Normalized role:', normalizedRole);
  console.log('Current path:', location.pathname);

  // Dashboard href based on role
  const dashboardHref = normalizedRole === 'peer_counsellor'
    ? '/staff/peer/dashboard'
    : normalizedRole === 'dean'
      ? '/staff/dean/dashboard'
      : '/staff/sumc/dashboard';

  // Define navigation items based on role - using let instead of const
  let navItems = [];
  
  // Check if we're on a peer counsellor path OR role is peer_counsellor
  const isPeerPath = location.pathname.includes('/staff/peer/');
  const isPeerRole = normalizedRole === 'peer_counsellor' || 
                      normalizedRole === 'peer' || 
                      normalizedRole === 'peer_counselor';

  if (normalizedRole === 'dean') {
    navItems = [
      { href: '/staff/dean/dashboard', label: 'Dean Dashboard', icon: 'fas fa-chart-line' }
    ];
  } else if (isPeerRole || isPeerPath) {
    // Show peer counsellor items if role matches OR if on peer path
    navItems = [
      { href: '/staff/peer/dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt' },
      { href: '/staff/peer/referrals', label: 'Referrals', icon: 'fas fa-user-md' },
      { href: '/staff/peer/follow-up-notes', label: 'Follow-Up Notes', icon: 'fas fa-sticky-note' },
      { href: '/staff/peer/high-risk-alerts', label: 'High-Risk Alerts', icon: 'fas fa-exclamation-triangle' }
    ];
  } else {
    // Default: sumc_counsellor
    navItems = [
      { href: '/staff/sumc/dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt' },
      { href: '/staff/sumc/high-risk-alerts', label: 'High-Risk Alerts', icon: 'fas fa-exclamation-triangle' },
      { href: '/staff/sumc/create-referral', label: 'Create Referral', icon: 'fas fa-plus' },
      { href: '/staff/sumc/schedule-sessions', label: 'Schedule Sessions', icon: 'fas fa-calendar-check' },
      { href: '/staff/sumc/resources', label: 'Resources', icon: 'fas fa-book' },
      { href: '/staff/sumc/add-resources', label: 'Add Resources', icon: 'fas fa-book-medical' }
    ];
  }

  // Debug: Log what nav items we're using
  console.log('Nav items being shown:', navItems.map(item => item.label));

  const isActive = (path) => location.pathname === path;

  return (
    <aside className={`${styles.sidebar} ${open ? styles.open : ''}`}>
      <div className={styles.sidebarHeader}>
        <Link to={dashboardHref} className={styles.brand} onClick={onClose}>
          <StaffBrand compact showLabel={false} align="center" />
        </Link>
      </div>

      <nav className={styles.nav}>
        <ul>
          {navItems.map((item) => (
            <li key={item.href} className={isActive(item.href) ? styles.active : ''}>
              <Link to={item.href} onClick={onClose}>
                <i className={item.icon}></i>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.sidebarFooter}>
        <Link to="/staff/login" onClick={onClose}>
          <i className="fas fa-sign-out-alt"></i>
          <span>Logout</span>
        </Link>
      </div>
    </aside>
  );
}