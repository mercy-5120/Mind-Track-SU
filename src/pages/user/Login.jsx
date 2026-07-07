import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserShield } from "react-icons/fa";
import Button from "../../components/Button";
import Input from "../../components/Input";
import logo from "../../Assets/Logo.png";
import { loginStudent } from "../../utils/studentSession";
import "../../styles/globals.css";

console.log("[Login] component loaded");

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Load remembered username on component mount
  useEffect(() => {
    const remembered = localStorage.getItem("rememberedUsername");
    if (remembered) {
      setUsername(remembered);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log("[Login] Attempting login for:", username);

      // Call the login function from studentSession
      const student = await loginStudent(username, password);

      console.log("[Login] Login successful:", student);

      // Store remember me preference if checked
      if (rememberMe) {
        localStorage.setItem("rememberedUsername", username);
      } else {
        localStorage.removeItem("rememberedUsername");
      }

      // Navigate to student dashboard
      navigate("/student/dashboard");
    } catch (err) {
      console.error("[Login] Login error:", err);
      setError(
        err.message ||
          "Unable to sign in right now. Please check your credentials and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <img src={logo} alt="MindTrackSU logo" className="logo" />
            <h1 className="title">MindTrack SU</h1>
            <p className="subtitle">Your safe space for wellness tracking</p>
          </div>

          <div className="sign-in-section">
            <h2 className="section-title">Student Sign In</h2>

            <form className="login-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="username" className="form-label">
                  Username or Email
                </label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username or email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="form-input"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="form-input"
                  disabled={loading}
                />
              </div>

              <div className="form-options">
                <label className="remember-me">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={loading}
                  />
                  Remember me
                </label>
                <Link to="/forgot-password" className="forgot-password">
                  Forgot Password?
                </Link>
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
                className="sign-in-button"
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
                {loading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            {/* Divider */}
            <div
              className="divider"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                margin: "20px 0",
              }}
            >
              <hr
                style={{
                  flex: 1,
                  border: "none",
                  borderTop: "1px solid #e6e8f0",
                }}
              />
              <span style={{ color: "#6b7280", fontSize: "14px" }}>or</span>
              <hr
                style={{
                  flex: 1,
                  border: "none",
                  borderTop: "1px solid #e6e8f0",
                }}
              />
            </div>

            {/* Continue Anonymously */}
            <div className="anonymous-section">
              <Button
                type="button"
                full
                onClick={() => navigate("/assessment-intro")}
                className="anonymous-button"
                variant="secondary"
                disabled={loading}
                style={{
                  padding: "14px 24px",
                  fontSize: "16px",
                  fontWeight: "600",
                  borderRadius: "10px",
                  background: "#f8fafc",
                  color: "#2a2a72",
                  border: "2px solid #2a2a72",
                  cursor: loading ? "default" : "pointer",
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.target.style.background = "#2a2a72";
                    e.target.style.color = "#fff";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.target.style.background = "#f8fafc";
                    e.target.style.color = "#2a2a72";
                  }
                }}
              >
                Continue Anonymously
              </Button>
              <p
                className="anonymous-note"
                style={{
                  marginTop: "8px",
                  fontSize: "13px",
                  color: "#6b7280",
                  textAlign: "center",
                }}
              >
                Take a quick wellness assessment without creating an account.
              </p>
            </div>

            {/* Staff Login Link */}
            <div
              style={{
                marginTop: "16px",
                paddingTop: "16px",
                borderTop: "1px solid #e6e8f0",
                textAlign: "center",
              }}
            >
              <Link
                to="/staff/login"
                style={{
                  color: "#4a8b6b",
                  textDecoration: "none",
                  fontSize: "14px",
                  fontWeight: "500",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(74, 139, 107, 0.08)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "transparent";
                }}
              >
                <FaUserShield size={16} />
                Staff Login
              </Link>
            </div>

            {/* Footer Links */}
            <div
              className="footer-links"
              style={{
                marginTop: "20px",
                textAlign: "center",
              }}
            >
              <p style={{ color: "#6b7280" }}>
                New to MindTrack SU?{" "}
                <Link
                  to="/create-account"
                  className="link-primary"
                  style={{
                    color: "#2a2a72",
                    fontWeight: "600",
                    textDecoration: "none",
                  }}
                >
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
