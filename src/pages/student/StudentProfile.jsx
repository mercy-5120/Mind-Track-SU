import React, { useState, useEffect } from "react";
import StudentLayout from "../../components/StudentLayout";
import {
  getCurrentStudent,
  updateStudentProfile,
} from "../../utils/studentSession";
import {
  FaUser,
  FaKey,
  FaIdCard,
  FaUniversity,
  FaBook,
  FaCheckCircle,
  FaEdit,
  FaLock,
  FaUserCircle,
  FaSave,
  FaTimes,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";

export default function StudentProfile() {
  const [student, setStudent] = useState(getCurrentStudent());
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    display_name: "",
    username: "",
    student_id: "",
    department: "",
    year_of_study: "",
    email: "",
    phone: "",
  });
  const [saveMessage, setSaveMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (student) {
      setFormData({
        display_name: student.display_name || "",
        username: student.username || "",
        student_id: student.student_id || "",
        department: student.department || "",
        year_of_study: student.year_of_study || "",
        email: student.email || "",
        phone: student.phone || "",
      });
    }
  }, [student]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    try {
      const updatedStudent = updateStudentProfile(formData);
      setStudent(updatedStudent);
      setIsEditing(false);
      setSaveMessage({
        type: "success",
        text: "Profile updated successfully!",
      });
      setTimeout(() => setSaveMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      setSaveMessage({
        type: "error",
        text: "Failed to update profile. Please try again.",
      });
      setTimeout(() => setSaveMessage({ type: "", text: "" }), 3000);
    }
  };

  const handleCancel = () => {
    setFormData({
      display_name: student.display_name || "",
      username: student.username || "",
      student_id: student.student_id || "",
      department: student.department || "",
      year_of_study: student.year_of_study || "",
      email: student.email || "",
      phone: student.phone || "",
    });
    setIsEditing(false);
    setSaveMessage({ type: "", text: "" });
  };

  if (!student) {
    return (
      <StudentLayout>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "80vh",
            background: "#fff",
            borderRadius: "18px",
            textAlign: "center",
            padding: "40px",
            boxShadow: "0 16px 32px rgba(42,42,114,0.08)",
          }}
        >
          <div>
            <FaUserCircle
              size={64}
              color="#2a2a72"
              style={{ marginBottom: "16px" }}
            />
            <h2 style={{ color: "#2a2a72", marginBottom: "12px" }}>
              No student signed in
            </h2>
            <p style={{ color: "#6b7280" }}>
              Please log in or create an account to view your profile.
            </p>
          </div>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div
        style={{
          display: "grid",
          gap: "24px",
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* Header Section - Full Width */}
        <div
          style={{
            background: "linear-gradient(135deg, #2a2a72 0%, #3a3a8a 100%)",
            borderRadius: "20px",
            padding: "40px 48px",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "24px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <div
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "42px",
                fontWeight: "bold",
                color: "#fff",
                flexShrink: 0,
              }}
            >
              {student.display_name
                ? student.display_name.charAt(0).toUpperCase()
                : student.username
                  ? student.username.charAt(0).toUpperCase()
                  : "S"}
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: "32px", fontWeight: "600" }}>
                {student.display_name ||
                  student.username ||
                  "Anonymous Student"}
              </h1>
              <p style={{ margin: "4px 0 0", opacity: 0.9, fontSize: "16px" }}>
                {student.department || "No department specified"} • Year{" "}
                {student.year_of_study || "N/A"}
              </p>
              {student.email && (
                <p
                  style={{ margin: "4px 0 0", opacity: 0.8, fontSize: "14px" }}
                >
                  <FaEnvelope style={{ marginRight: "8px" }} size={14} />
                  {student.email}
                </p>
              )}
            </div>
          </div>
          <div>
            <span
              style={{
                padding: "8px 20px",
                background: "rgba(255,255,255,0.2)",
                borderRadius: "20px",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              <FaCheckCircle style={{ marginRight: "8px" }} size={14} />
              Active Account
            </span>
          </div>
        </div>

        {/* Save Message */}
        {saveMessage.text && (
          <div
            style={{
              padding: "16px 24px",
              borderRadius: "12px",
              background:
                saveMessage.type === "success" ? "#d4edda" : "#f8d7da",
              color: saveMessage.type === "success" ? "#155724" : "#721c24",
              border: `1px solid ${saveMessage.type === "success" ? "#c3e6cb" : "#f5c6cb"}`,
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            {saveMessage.type === "success" ? <FaCheckCircle /> : <FaTimes />}
            {saveMessage.text}
          </div>
        )}

        {/* Profile Content - Full Width */}
        <div
          style={{
            background: "#fff",
            borderRadius: "20px",
            padding: "40px 48px",
            boxShadow: "0 16px 32px rgba(42,42,114,0.08)",
          }}
        >
          {!isEditing ? (
            // View Mode
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "32px",
                  flexWrap: "wrap",
                  gap: "16px",
                }}
              >
                <h2 style={{ margin: 0, color: "#2a2a72" }}>Profile Details</h2>
                <button
                  style={{
                    padding: "10px 24px",
                    background: "#2a2a72",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "500",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "#1a1a5a";
                    e.target.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "#2a2a72";
                    e.target.style.transform = "translateY(0)";
                  }}
                  onClick={() => setIsEditing(true)}
                >
                  <FaEdit size={16} />
                  Edit Profile
                </button>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "24px",
                }}
              >
                {/* Name */}
                <div
                  style={{
                    padding: "20px",
                    background: "#f8fafc",
                    borderRadius: "12px",
                    borderLeft: "4px solid #2a2a72",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "6px",
                    }}
                  >
                    <FaUser color="#2a2a72" size={18} />
                    <strong style={{ color: "#2a2a72", fontSize: "14px" }}>
                      Full Name
                    </strong>
                  </div>
                  <p style={{ margin: 0, fontSize: "16px", color: "#1f2937" }}>
                    {student.display_name || student.username || "Not set"}
                  </p>
                </div>

                {/* Username */}
                <div
                  style={{
                    padding: "20px",
                    background: "#f8fafc",
                    borderRadius: "12px",
                    borderLeft: "4px solid #4a8b6b",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "6px",
                    }}
                  >
                    <FaKey color="#4a8b6b" size={18} />
                    <strong style={{ color: "#4a8b6b", fontSize: "14px" }}>
                      Username
                    </strong>
                  </div>
                  <p style={{ margin: 0, fontSize: "16px", color: "#1f2937" }}>
                    {student.username || "Not set"}
                  </p>
                </div>

                {/* Student ID */}
                <div
                  style={{
                    padding: "20px",
                    background: "#f8fafc",
                    borderRadius: "12px",
                    borderLeft: "4px solid #2a2a72",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "6px",
                    }}
                  >
                    <FaIdCard color="#2a2a72" size={18} />
                    <strong style={{ color: "#2a2a72", fontSize: "14px" }}>
                      Student ID
                    </strong>
                  </div>
                  <p style={{ margin: 0, fontSize: "16px", color: "#1f2937" }}>
                    {student.student_id || "Not available"}
                  </p>
                </div>

                {/* Department */}
                <div
                  style={{
                    padding: "20px",
                    background: "#f8fafc",
                    borderRadius: "12px",
                    borderLeft: "4px solid #4a8b6b",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "6px",
                    }}
                  >
                    <FaUniversity color="#4a8b6b" size={18} />
                    <strong style={{ color: "#4a8b6b", fontSize: "14px" }}>
                      Department
                    </strong>
                  </div>
                  <p style={{ margin: 0, fontSize: "16px", color: "#1f2937" }}>
                    {student.department || "Not set"}
                  </p>
                </div>

                {/* Year of Study */}
                <div
                  style={{
                    padding: "20px",
                    background: "#f8fafc",
                    borderRadius: "12px",
                    borderLeft: "4px solid #2a2a72",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "6px",
                    }}
                  >
                    <FaBook color="#2a2a72" size={18} />
                    <strong style={{ color: "#2a2a72", fontSize: "14px" }}>
                      Year of Study
                    </strong>
                  </div>
                  <p style={{ margin: 0, fontSize: "16px", color: "#1f2937" }}>
                    {student.year_of_study || "Not set"}
                  </p>
                </div>

                {/* Email */}
                <div
                  style={{
                    padding: "20px",
                    background: "#f8fafc",
                    borderRadius: "12px",
                    borderLeft: "4px solid #4a8b6b",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "6px",
                    }}
                  >
                    <FaEnvelope color="#4a8b6b" size={18} />
                    <strong style={{ color: "#4a8b6b", fontSize: "14px" }}>
                      Email
                    </strong>
                  </div>
                  <p style={{ margin: 0, fontSize: "16px", color: "#1f2937" }}>
                    {student.email || "Not set"}
                  </p>
                </div>
              </div>
            </>
          ) : (
            // Edit Mode
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "32px",
                  flexWrap: "wrap",
                  gap: "16px",
                }}
              >
                <h2 style={{ margin: 0, color: "#2a2a72" }}>Edit Profile</h2>
                <div style={{ display: "flex", gap: "12px" }}>
                  <button
                    style={{
                      padding: "10px 24px",
                      background: "#6b7280",
                      color: "#fff",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontWeight: "500",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "#4a5568";
                      e.target.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "#6b7280";
                      e.target.style.transform = "translateY(0)";
                    }}
                    onClick={handleCancel}
                  >
                    <FaTimes size={16} />
                    Cancel
                  </button>
                  <button
                    style={{
                      padding: "10px 24px",
                      background: "#4a8b6b",
                      color: "#fff",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontWeight: "500",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "#3a7a5a";
                      e.target.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "#4a8b6b";
                      e.target.style.transform = "translateY(0)";
                    }}
                    onClick={handleSave}
                  >
                    <FaSave size={16} />
                    Save Changes
                  </button>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                  gap: "24px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <label style={{ fontWeight: "500", color: "#2a2a72" }}>
                    <FaUser style={{ marginRight: "8px" }} />
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="display_name"
                    value={formData.display_name}
                    onChange={handleInputChange}
                    style={{
                      padding: "12px 16px",
                      borderRadius: "8px",
                      border: "1px solid #d1d5db",
                      fontSize: "16px",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#2a2a72")}
                    onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <label style={{ fontWeight: "500", color: "#2a2a72" }}>
                    <FaKey style={{ marginRight: "8px" }} />
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    style={{
                      padding: "12px 16px",
                      borderRadius: "8px",
                      border: "1px solid #d1d5db",
                      fontSize: "16px",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#2a2a72")}
                    onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <label style={{ fontWeight: "500", color: "#2a2a72" }}>
                    <FaIdCard style={{ marginRight: "8px" }} />
                    Student ID
                  </label>
                  <input
                    type="text"
                    name="student_id"
                    value={formData.student_id}
                    onChange={handleInputChange}
                    style={{
                      padding: "12px 16px",
                      borderRadius: "8px",
                      border: "1px solid #d1d5db",
                      fontSize: "16px",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#2a2a72")}
                    onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <label style={{ fontWeight: "500", color: "#4a8b6b" }}>
                    <FaUniversity style={{ marginRight: "8px" }} />
                    Department
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    style={{
                      padding: "12px 16px",
                      borderRadius: "8px",
                      border: "1px solid #d1d5db",
                      fontSize: "16px",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#4a8b6b")}
                    onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <label style={{ fontWeight: "500", color: "#2a2a72" }}>
                    <FaBook style={{ marginRight: "8px" }} />
                    Year of Study
                  </label>
                  <input
                    type="text"
                    name="year_of_study"
                    value={formData.year_of_study}
                    onChange={handleInputChange}
                    style={{
                      padding: "12px 16px",
                      borderRadius: "8px",
                      border: "1px solid #d1d5db",
                      fontSize: "16px",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#2a2a72")}
                    onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <label style={{ fontWeight: "500", color: "#4a8b6b" }}>
                    <FaEnvelope style={{ marginRight: "8px" }} />
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    style={{
                      padding: "12px 16px",
                      borderRadius: "8px",
                      border: "1px solid #d1d5db",
                      fontSize: "16px",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#4a8b6b")}
                    onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </StudentLayout>
  );
}
