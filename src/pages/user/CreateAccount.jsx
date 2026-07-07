// src/pages/user/CreateAccount.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaUniversity,
  FaBook,
  FaIdCard,
} from "react-icons/fa";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { registerStudent } from "../../utils/studentSession";
import { departments } from "../../utils/departments";
import logo from "../../Assets/Logo.png";
import "../../styles/globals.css";

export default function CreateAccount() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    displayName: "",
    studentId: "",
    department: "",
    yearOfStudy: "",
    email: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (
      !formData.username ||
      !formData.password ||
      !formData.displayName ||
      !formData.department
    ) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const student = await registerStudent({
        username: formData.username,
        password: formData.password,
        displayName: formData.displayName,
        studentId: formData.studentId,
        department: formData.department,
        yearOfStudy: formData.yearOfStudy,
        email: formData.email,
        phone: formData.phone,
      });

      console.log("[CreateAccount] Student registered:", student);
      navigate("/student/dashboard");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const yearOptions = [
    { value: "1", label: "Year 1" },
    { value: "2", label: "Year 2" },
    { value: "3", label: "Year 3" },
    { value: "4", label: "Year 4" },
  ];

  return (
    <div className="auth-page">
      <div className="auth-container" style={{ maxWidth: "560px" }}>
        <div className="auth-card">
          <div className="login-header">
            <img src={logo} alt="MindTrackSU logo" className="logo" />
            <h1 className="title">MindTrack SU</h1>
            <p className="subtitle">Create your student account</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "14px" }}
            >
              {/* Display Name */}
              <div className="form-group">
                <label className="form-label">
                  <FaUser style={{ marginRight: "6px" }} size={14} />
                  Full Name *
                </label>
                <Input
                  type="text"
                  name="displayName"
                  placeholder="Enter your full name"
                  value={formData.displayName}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Username */}
              <div className="form-group">
                <label className="form-label">
                  <FaUser style={{ marginRight: "6px" }} size={14} />
                  Username *
                </label>
                <Input
                  type="text"
                  name="username"
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Student ID */}
              <div className="form-group">
                <label className="form-label">
                  <FaIdCard style={{ marginRight: "6px" }} size={14} />
                  Registration Number
                </label>
                <Input
                  type="text"
                  name="studentId"
                  placeholder="Enter your registration number (optional)"
                  value={formData.studentId}
                  onChange={handleChange}
                />
              </div>

              {/* Department - DROPDOWN */}
              <div className="form-group">
                <label className="form-label">
                  <FaUniversity style={{ marginRight: "6px" }} size={14} />
                  Department *
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                  className="form-input"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "16px",
                    background: "#fff",
                    appearance: "auto",
                    cursor: "pointer",
                  }}
                >
                  <option value="">Select your department</option>
                  {departments.map((dept) => (
                    <option key={dept.value} value={dept.value}>
                      {dept.value} - {dept.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year of Study - DROPDOWN */}
              <div className="form-group">
                <label className="form-label">
                  <FaBook style={{ marginRight: "6px" }} size={14} />
                  Year of Study *
                </label>
                <select
                  name="yearOfStudy"
                  value={formData.yearOfStudy}
                  onChange={handleChange}
                  required
                  className="form-input"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "16px",
                    background: "#fff",
                    appearance: "auto",
                    cursor: "pointer",
                  }}
                >
                  <option value="">Select your year</option>
                  {yearOptions.map((year) => (
                    <option key={year.value} value={year.value}>
                      {year.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Email */}
              <div className="form-group">
                <label className="form-label">
                  <FaEnvelope style={{ marginRight: "6px" }} size={14} />
                  Email Address
                </label>
                <Input
                  type="email"
                  name="email"
                  placeholder="Enter your email (optional)"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              {/* Phone */}
              <div className="form-group">
                <label className="form-label">
                  <FaPhone style={{ marginRight: "6px" }} size={14} />
                  Phone Number
                </label>
                <Input
                  type="tel"
                  name="phone"
                  placeholder="Enter your phone number (optional)"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              {/* Password */}
              <div className="form-group">
                <label className="form-label">
                  <FaLock style={{ marginRight: "6px" }} size={14} />
                  Password *
                </label>
                <Input
                  type="password"
                  name="password"
                  placeholder="Create a password (min 6 characters)"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Confirm Password */}
              <div className="form-group">
                <label className="form-label">
                  <FaLock style={{ marginRight: "6px" }} size={14} />
                  Confirm Password *
                </label>
                <Input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              {error && (
                <div
                  className="error-message"
                  style={{
                    color: "#b34747",
                    background: "#fef2f2",
                    padding: "12px 16px",
                    borderRadius: "8px",
                    border: "1px solid #fecaca",
                    fontSize: "14px",
                    textAlign: "center",
                  }}
                >
                  {error}
                </div>
              )}

              <Button
                type="submit"
                full
                disabled={loading}
                style={{
                  padding: "14px 24px",
                  fontSize: "16px",
                  fontWeight: "600",
                  borderRadius: "10px",
                  background: loading ? "#6b7280" : "#2a2a72",
                  cursor: loading ? "default" : "pointer",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
            </div>
          </form>

          <div
            className="footer-links"
            style={{
              marginTop: "20px",
              textAlign: "center",
            }}
          >
            <p style={{ color: "#6b7280" }}>
              Already have an account?{" "}
              <Link
                to="/login"
                className="link-primary"
                style={{
                  color: "#2a2a72",
                  fontWeight: "600",
                  textDecoration: "none",
                }}
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
