import React, { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/Button";
import Input from "../../components/Input";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Password reset requested for:", email);
    alert("Check your email for password reset link");
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <img src="/Logo.png" alt="MindTrackSU Logo" className="auth-logo" />
            <h1>Reset Password</h1>
            <p>
              Enter your email and we'll send you a link to reset your password
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <Input
              label="Email Address"
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" full>
              Send Reset Link
            </Button>
          </form>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <div className="auth-links">
            <p>
              Remember your password?
              <Link to="/login" className="link-primary">
                Log in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
