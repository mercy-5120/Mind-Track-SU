import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import Input from "../../components/Input";
import logo from "../../Assets/Logo.png";

export default function CreateAccount() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "", confirm: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      alert("Passwords do not match.");
      return;
    }
    navigate("/assessment-intro");
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <img src={logo} alt="MindTrackSU logo" className="auth-logo" />
            <h1>Create Your Anonymous Account</h1>
            <p>
              Choose a username and password to return to your private
              check-ins.
            </p>
          </div>
          <form className="auth-form" onSubmit={handleSubmit}>
            <Input
              label="Username"
              id="username"
              type="text"
              placeholder="Choose a username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
            <Input
              label="Password"
              id="password"
              type="password"
              placeholder="Create a password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <Input
              label="Confirm Password"
              id="confirm"
              type="password"
              placeholder="Confirm password"
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              required
            />
            <p style={{ color: "var(--warm-gray)", fontSize: "0.9rem" }}>
              Use at least 6 characters and keep it private.
            </p>
            <Button type="submit" full>
              Create Account
            </Button>
          </form>
          <div className="auth-divider">
            <span>or</span>
          </div>
          <div className="auth-links">
            <p>
              Already have an account?{" "}
              <Link to="/login" className="link-primary">
                Log in here
              </Link>
            </p>
            <p style={{ marginTop: "8px" }}>
              <Link to="/assessment-intro" className="link-primary">
                Continue as guest
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
