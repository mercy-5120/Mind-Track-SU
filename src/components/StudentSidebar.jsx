// src/components/StudentSidebar.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import StudentBrand from "./StudentBrand";
import { getCurrentStudent, logoutStudent } from "../utils/studentSession";
import styles from "../styles/StudentSidebar.module.css";

export default function StudentSidebar({ open, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentStudent, setCurrentStudent] = useState(null);

  useEffect(() => {
    const student = getCurrentStudent();
    console.log("[StudentSidebar] Current student:", student);
    setCurrentStudent(student);
  }, [open]);

  const displayName =
    currentStudent?.display_name || currentStudent?.username || "Student";
  const studentId = currentStudent?.student_id
    ? `ID: ${currentStudent.student_id}`
    : "Guest";

  const navItems = [
    {
      href: "/student/dashboard",
      label: "Dashboard",
      icon: "fas fa-tachometer-alt",
    },
    {
      href: "/student/history",
      label: "Assessment History",
      icon: "fas fa-history",
    },
    { href: "/student/profile", label: "Profile", icon: "fas fa-user" },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logoutStudent();
    navigate("/login");
  };

  return (
    <aside className={`${styles.sidebar} ${open ? styles.open : ""}`}>
      <div className={styles.sidebarHeader}>
        <Link
          to="/student/dashboard"
          className={styles.brand}
          onClick={onClose}
        >
          <StudentBrand compact={false} align="center" size="large" />
        </Link>
      </div>

      <div className={styles.studentInfo}>
        <div className={styles.studentName}>{displayName}</div>
        <div className={styles.studentId}>{studentId}</div>
        {currentStudent?.email && (
          <div
            className={styles.studentEmail}
            style={{
              fontSize: "12px",
              color: "#6b7280",
              marginTop: "4px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {currentStudent.email}
          </div>
        )}
      </div>

      <nav className={styles.nav}>
        <ul>
          {navItems.map((item) => (
            <li
              key={item.href}
              className={isActive(item.href) ? styles.active : ""}
            >
              <Link to={item.href} onClick={onClose}>
                <i className={item.icon}></i>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.sidebarFooter}>
        <button
          type="button"
          className={styles.logoutButton}
          onClick={handleLogout}
          style={{
            width: "100%",
            padding: "14px 20px",
            background: "#dc3545",
            color: "#fff",
            border: "none",
            borderRadius: "12px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            transition: "all 0.2s ease",
            boxShadow: "0 4px 12px rgba(220,53,69,0.3)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#c82333";
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 6px 20px rgba(220,53,69,0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#dc3545";
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(220,53,69,0.3)";
          }}
        >
          <i className="fas fa-sign-out-alt" style={{ fontSize: "18px" }}></i>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
