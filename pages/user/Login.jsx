import React, { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/Button";
import Input from "../../components/Input";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Welcome Back</h1>
            <p>Log in to continue your mental health journey</p>
          </div>
          <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
            <Input
              label="Email Address"
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
