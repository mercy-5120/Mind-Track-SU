import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "../styles/StudentSidebar.module.css";
import StaffBrand from "./StaffBrand";
import { getCurrentStudent, logoutStudent } from "../utils/studentSession";

export default function StudentSidebar({ open, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentStudent = getCurrentStudent();

  const displayName = currentStudent?.display_name || currentStudent?.username || "Student";
  const studentId = currentStudent?.student_id ? `ID: ${currentStudent.student_id}` : "Guest";

  const navItems = [
    { href: "/student/dashboard", label: "Dashboard", icon: "fas fa-tachometer-alt" },
    { href: "/student/profile", label: "Profile", icon: "fas fa-user" },
    { href: "/student/history", label: "Assessment History", icon: "fas fa-history" },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logoutStudent();
    navigate("/login");
  };

  return (
    <aside className={`${styles.sidebar} ${open ? styles.open : ""}`}>
      <div className={styles.sidebarHeader}>
        <Link to="/student/dashboard" className={styles.brand} onClick={onClose}>
          <StaffBrand compact showLabel={false} align="center" />
        </Link>
        <div className={styles.brandText}>
          <span className={styles.brandTitle}>Student Portal</span>
        </div>
      </div>

      <div className={styles.studentInfo}>
        <div className={styles.studentName}>{displayName}</div>
        <div className={styles.studentId}>{studentId}</div>
      </div>

      <nav className={styles.nav}>
        <ul>
          {navItems.map((item) => (
            <li key={item.href} className={isActive(item.href) ? styles.active : ""}>
              <Link to={item.href} onClick={onClose}>
                <i className={item.icon}></i>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.sidebarFooter}>
        <button type="button" className={styles.logoutButton} onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i>
          Logout
        </button>
      </div>
    </aside>
  );
}
