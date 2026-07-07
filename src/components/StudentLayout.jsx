import React, { useState } from "react";
import StudentSidebar from "./StudentSidebar";
import styles from "../styles/StudentLayout.module.css";

export default function StudentLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className={styles.layoutContainer}>
      <StudentSidebar open={sidebarOpen} onClose={closeSidebar} />
      <main className={styles.mainContent}>{children}</main>
    </div>
  );
}
