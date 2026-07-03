import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import Input from "../../components/Input";
import logo from "../../Assets/Logo.png";
import { registerStudent } from "../../utils/studentSession";
import "../../styles/globals.css";

export default function CreateAccount() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }

    try {
      registerStudent({
        username: form.username,
        password: form.password,
        displayName: form.username,
      });
      navigate("/assessment-intro");
    } catch (error) {
      setError(error.message || "Unable to create your account.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <img src={logo} alt="MindTrackSU logo" className="logo" />
            <h1 className="title">MindTrack SU</h1>
            <p className="subtitle">
              Create your account to track your wellness journey
            </p>
          </div>

          <div className="sign-in-section">
            <h2 className="section-title">Create Your Account</h2>

            <form className="login-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="username" className="form-label">
                  Username
                </label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Choose a username"
                  value={form.username}
                  onChange={(e) =>
                    setForm({ ...form, username: e.target.value })
                  }
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
                  placeholder="Create a password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirm" className="form-label">
                  Confirm Password
                </label>
                <Input
                  id="confirm"
                  type="password"
                  placeholder="Confirm password"
                  value={form.confirm}
                  onChange={(e) =>
                    setForm({ ...form, confirm: e.target.value })
                  }
                  required
                  className="form-input"
                />
              </div>

              <p className="form-note">
                This creates a normal student account so you can keep your own
                assessment history and return later.
              </p>

              {error && <p className="error-message">{error}</p>}

              <Button type="submit" full className="sign-in-button">
                Create Account
              </Button>
            </form>

            <div className="divider">
              <span>or</span>
            </div>

            <div className="footer-links">
              <p>
                Already have an account?{" "}
                <Link to="/login" className="link-primary">
                  Log in here
                </Link>
              </p>
              <p style={{ marginTop: "8px" }}>
                Are you a member of staff?{" "}
                <Link to="/staff/login" className="link-primary">
                  Staff login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
