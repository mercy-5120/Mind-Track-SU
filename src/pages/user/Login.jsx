import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import Input from "../../components/Input";
import logo from "../../Assets/Logo.png";
import { loginStudent } from "../../utils/studentSession";
import "../../styles/globals.css"; // Import your global CSS

console.log("[Login] component loaded");

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      loginStudent(username, password);
      navigate("/assessment-intro");
    } catch (err) {
      setError(err.message || "Unable to sign in right now.");
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
                  Email or Registration Number
                </label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter email or registration number"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="form-input"
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
                />
              </div>

              <div className="form-options">
                <label className="remember-me">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  Remember me
                </label>
                <Link to="/forgot-password" className="forgot-password">
                  Forgot Password?
                </Link>
              </div>

              {error && <p className="error-message">{error}</p>}

              <Button type="submit" full className="sign-in-button">
                Sign In
              </Button>
            </form>

            <div className="divider">
              <span>or</span>
            </div>

            <div className="anonymous-section">
              <Button
                type="button"
                full
                onClick={() => navigate("/assessment-intro")}
                className="anonymous-button"
              >
                Continue Anonymously
              </Button>
              <p className="anonymous-note">
                Take a quick wellness assessment without creating an account.
              </p>
            </div>

            <div className="footer-links">
              <p>
                New to MindTrack SU?{" "}
                <Link to="/create-account" className="link-primary">
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
