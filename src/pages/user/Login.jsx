import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import Input from "../../components/Input";
import logo from "../../Assets/Logo.png";
import { loginStudent } from "../../utils/studentSession";

console.log("[Login] component loaded");

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

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
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <img src={logo} alt="MindTrackSU logo" className="auth-logo" />
            <h1>Welcome Back</h1>
            <p>Log in to continue your private wellness journey</p>
          </div>
          <form className="auth-form" onSubmit={handleSubmit}>
            <Input
              label="Username"
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <Input
              label="Password"
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Link
              to="/forgot-password"
              style={{
                textAlign: "right",
                fontSize: "0.9rem",
                color: "var(--primary)",
                textDecoration: "none",
              }}
            >
              Forgot password?
            </Link>
            {error ? (
              <p style={{ color: "var(--brick-dust)", fontSize: "0.9rem" }}>
                {error}
              </p>
            ) : null}
            <Button type="submit" full>
              Log In
            </Button>
          </form>
          <div className="auth-divider">
            <span>or</span>
          </div>
          <div className="auth-links">
            <p>
              Don't have an account?{" "}
              <Link to="/create-account" className="link-primary">
                Sign up here
              </Link>
            </p>
            <p>
              Do you want to continue anonymously?{" "}
              <Link to="/assessment-intro" className="link-primary">
                Continue anonymously
              </Link>
            </p>
            <p>
              Are you a member of staff?{" "}
              <Link to="/staff/login" className="link-primary">
                Staff login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
