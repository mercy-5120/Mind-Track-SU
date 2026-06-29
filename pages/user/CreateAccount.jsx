import React, { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/Button";
import Input from "../../components/Input";

export default function CreateAccount() {
  const [form, setForm] = useState({ email: "", password: "", confirm: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      alert("Passwords do not match");
      return;
    }
    console.log("Signup attempt:", form);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Create Your Anonymous Account</h1>
            <p>No email or registration number required.</p>
          </div>
          <form className="auth-form" onSubmit={handleSubmit}>
            <Input
              label="Email Address"
              id="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
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
            <Button type="submit" full>
              Create Account
            </Button>
          </form>
          <div className="auth-divider">
            <span>or</span>
          </div>
          <div className="auth-links">
            <p>
              Already have an account? <Link to="/login" className="link-primary">Log in here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
