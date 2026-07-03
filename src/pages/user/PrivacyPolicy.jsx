// src/pages/user/PrivacyPolicy.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8f7f5",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          background: "white",
          borderRadius: "18px",
          padding: "48px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
        }}
      >
        <h1
          style={{
            marginBottom: "8px",
            fontSize: "2rem",
            color: "var(--primary)",
          }}
        >
          Privacy Policy
        </h1>
        <p style={{ color: "var(--warm-gray)", marginBottom: "32px" }}>
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <div style={{ textAlign: "left", lineHeight: "1.8" }}>
          <h2
            style={{
              fontSize: "1.1rem",
              marginTop: "28px",
              color: "var(--text)",
            }}
          >
            1. Introduction
          </h2>
          <p style={{ color: "var(--warm-gray)" }}>
            MindTrackSU ("we", "our", "us") is committed to protecting your
            privacy. This Privacy Policy explains how we collect, use, and
            safeguard your information when you use our mental wellness tracking
            platform.
          </p>

          <h2
            style={{
              fontSize: "1.1rem",
              marginTop: "28px",
              color: "var(--text)",
            }}
          >
            2. Information We Collect
          </h2>
          <p style={{ color: "var(--warm-gray)" }}>
            We collect information that you voluntarily provide to us:
          </p>
          <ul style={{ color: "var(--warm-gray)", paddingLeft: "20px" }}>
            <li>Email address (if you create an account)</li>
            <li>
              Phone number (if you choose to provide it for counselling contact)
            </li>
            <li>Assessment responses and wellness check-in data</li>
            <li>Anonymous usage data to improve our service</li>
          </ul>

          <h2
            style={{
              fontSize: "1.1rem",
              marginTop: "28px",
              color: "var(--text)",
            }}
          >
            3. How We Use Your Information
          </h2>
          <p style={{ color: "var(--warm-gray)" }}>
            Your information is used to:
          </p>
          <ul style={{ color: "var(--warm-gray)", paddingLeft: "20px" }}>
            <li>Provide personalized mental wellness guidance</li>
            <li>Connect you with appropriate support resources</li>
            <li>
              Track your wellness patterns over time (if you have an account)
            </li>
            <li>Improve and optimize our platform</li>
          </ul>

          <h2
            style={{
              fontSize: "1.1rem",
              marginTop: "28px",
              color: "var(--text)",
            }}
          >
            4. Data Protection
          </h2>
          <p style={{ color: "var(--warm-gray)" }}>
            We implement appropriate technical and organizational measures to
            protect your personal information against unauthorized access,
            alteration, disclosure, or destruction. Your assessment responses
            are anonymized to protect your identity.
          </p>

          <h2
            style={{
              fontSize: "1.1rem",
              marginTop: "28px",
              color: "var(--text)",
            }}
          >
            5. Data Retention
          </h2>
          <p style={{ color: "var(--warm-gray)" }}>
            We retain your personal information only for as long as necessary to
            fulfill the purposes outlined in this Privacy Policy. You may
            request deletion of your account and associated data at any time.
          </p>

          <h2
            style={{
              fontSize: "1.1rem",
              marginTop: "28px",
              color: "var(--text)",
            }}
          >
            6. Your Rights
          </h2>
          <p style={{ color: "var(--warm-gray)" }}>You have the right to:</p>
          <ul style={{ color: "var(--warm-gray)", paddingLeft: "20px" }}>
            <li>Access the personal information we hold about you</li>
            <li>Request correction of inaccurate information</li>
            <li>Request deletion of your data</li>
            <li>Opt-out of communications</li>
          </ul>

          <h2
            style={{
              fontSize: "1.1rem",
              marginTop: "28px",
              color: "var(--text)",
            }}
          >
            7. Cookies
          </h2>
          <p style={{ color: "var(--warm-gray)" }}>
            We use cookies to enhance your experience on our platform. Cookies
            help us understand how you interact with our service and remember
            your preferences for future visits.
          </p>

          <h2
            style={{
              fontSize: "1.1rem",
              marginTop: "28px",
              color: "var(--text)",
            }}
          >
            8. Third-Party Services
          </h2>
          <p style={{ color: "var(--warm-gray)" }}>
            We may use third-party services to support our platform. These
            services have their own privacy policies and we recommend reviewing
            them. We do not share your personal information with third parties
            except as necessary to provide our services.
          </p>

          <h2
            style={{
              fontSize: "1.1rem",
              marginTop: "28px",
              color: "var(--text)",
            }}
          >
            9. Contact Us
          </h2>
          <p style={{ color: "var(--warm-gray)" }}>
            If you have questions about this Privacy Policy or our data
            practices, please contact us at:{" "}
            <strong>support@mindtracksu.com</strong>
          </p>

          <h2
            style={{
              fontSize: "1.1rem",
              marginTop: "28px",
              color: "var(--text)",
            }}
          >
            10. Changes to This Policy
          </h2>
          <p style={{ color: "var(--warm-gray)" }}>
            We may update this Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page
            and updating the "Last updated" date.
          </p>
        </div>

        <Link
          to="/"
          style={{
            display: "block",
            marginTop: "40px",
            padding: "14px 24px",
            background: "var(--primary)",
            color: "white",
            textDecoration: "none",
            borderRadius: "12px",
            textAlign: "center",
            transition: "opacity 0.2s",
            fontWeight: 500,
          }}
          onMouseEnter={(e) => (e.target.style.opacity = "0.8")}
          onMouseLeave={(e) => (e.target.style.opacity = "1")}
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}
