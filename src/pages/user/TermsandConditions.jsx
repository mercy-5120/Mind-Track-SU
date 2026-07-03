// src/pages/user/TermsandConditions.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function TermsandConditions() {
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
          Terms & Conditions
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
            1. Acceptance of Terms
          </h2>
          <p style={{ color: "var(--warm-gray)" }}>
            By using MindTrackSU ("the Platform"), you agree to be bound by
            these Terms & Conditions. If you do not agree to these terms, please
            do not use our services.
          </p>

          <h2
            style={{
              fontSize: "1.1rem",
              marginTop: "28px",
              color: "var(--text)",
            }}
          >
            2. Description of Service
          </h2>
          <p style={{ color: "var(--warm-gray)" }}>
            MindTrackSU provides a mental wellness tracking and support platform
            for university students. Our services include wellness assessments,
            personalized guidance, and connections to support resources.
          </p>

          <h2
            style={{
              fontSize: "1.1rem",
              marginTop: "28px",
              color: "var(--text)",
            }}
          >
            3. User Accounts
          </h2>
          <p style={{ color: "var(--warm-gray)" }}>
            You may use our platform anonymously or create an account. If you
            create an account:
          </p>
          <ul style={{ color: "var(--warm-gray)", paddingLeft: "20px" }}>
            <li>
              You are responsible for maintaining the confidentiality of your
              account
            </li>
            <li>You agree to provide accurate and complete information</li>
            <li>You may delete your account at any time</li>
          </ul>

          <h2
            style={{
              fontSize: "1.1rem",
              marginTop: "28px",
              color: "var(--text)",
            }}
          >
            4. User Responsibilities
          </h2>
          <p style={{ color: "var(--warm-gray)" }}>You agree to:</p>
          <ul style={{ color: "var(--warm-gray)", paddingLeft: "20px" }}>
            <li>Use the platform responsibly and for its intended purpose</li>
            <li>Not misuse or abuse the platform or its resources</li>
            <li>Not attempt to access or compromise the platform's security</li>
            <li>
              Not share or distribute content that is harmful or inappropriate
            </li>
          </ul>

          <h2
            style={{
              fontSize: "1.1rem",
              marginTop: "28px",
              color: "var(--text)",
            }}
          >
            5. Confidentiality and Privacy
          </h2>
          <p style={{ color: "var(--warm-gray)" }}>
            We prioritize your privacy and confidentiality. Your assessment
            responses are handled with care and anonymized where possible. We do
            not share your personal information without your consent, except as
            required by law or to prevent harm.
          </p>

          <h2
            style={{
              fontSize: "1.1rem",
              marginTop: "28px",
              color: "var(--text)",
            }}
          >
            6. Emergency and Crisis Support
          </h2>
          <p style={{ color: "var(--warm-gray)" }}>
            <strong style={{ color: "var(--brick-dust)" }}>IMPORTANT:</strong>{" "}
            MindTrackSU is not a crisis support or emergency service. If you are
            in immediate danger or experiencing a mental health crisis, please
            call emergency services immediately:
          </p>
          <ul style={{ color: "var(--warm-gray)", paddingLeft: "20px" }}>
            <li>
              <strong>Emergency:</strong> 911
            </li>
            <li>
              <strong>Crisis Support:</strong> 1199
            </li>
            <li>
              <strong>Suicide Prevention:</strong> 988
            </li>
          </ul>

          <h2
            style={{
              fontSize: "1.1rem",
              marginTop: "28px",
              color: "var(--text)",
            }}
          >
            7. Disclaimer of Liability
          </h2>
          <p style={{ color: "var(--warm-gray)" }}>
            MindTrackSU provides mental wellness support and guidance but does
            not provide medical or professional mental health treatment. Our
            platform is not a substitute for professional medical advice,
            diagnosis, or treatment.
          </p>

          <h2
            style={{
              fontSize: "1.1rem",
              marginTop: "28px",
              color: "var(--text)",
            }}
          >
            8. Intellectual Property
          </h2>
          <p style={{ color: "var(--warm-gray)" }}>
            All content on MindTrackSU, including text, graphics, logos, and
            software, is the property of MindTrackSU and protected by copyright
            laws. You may not reproduce, distribute, or create derivative works
            without our express permission.
          </p>

          <h2
            style={{
              fontSize: "1.1rem",
              marginTop: "28px",
              color: "var(--text)",
            }}
          >
            9. Termination
          </h2>
          <p style={{ color: "var(--warm-gray)" }}>
            We reserve the right to suspend or terminate your access to the
            platform at any time for violation of these terms or other
            inappropriate conduct.
          </p>

          <h2
            style={{
              fontSize: "1.1rem",
              marginTop: "28px",
              color: "var(--text)",
            }}
          >
            10. Changes to Terms
          </h2>
          <p style={{ color: "var(--warm-gray)" }}>
            We may update these Terms & Conditions from time to time. We will
            notify you of any changes by posting the new terms on this page and
            updating the "Last updated" date.
          </p>

          <h2
            style={{
              fontSize: "1.1rem",
              marginTop: "28px",
              color: "var(--text)",
            }}
          >
            11. Contact Information
          </h2>
          <p style={{ color: "var(--warm-gray)" }}>
            For questions about these Terms & Conditions, please contact us at:
            <br />
            <strong>Email:</strong> support@mindtracksu.com
          </p>

          <h2
            style={{
              fontSize: "1.1rem",
              marginTop: "28px",
              color: "var(--text)",
            }}
          >
            12. Governing Law
          </h2>
          <p style={{ color: "var(--warm-gray)" }}>
            These terms are governed by the laws of the jurisdiction in which
            MindTrackSU operates. Any disputes arising from these terms shall be
            resolved in the appropriate courts.
          </p>
        </div>

        <div
          style={{
            marginTop: "40px",
            padding: "20px",
            background: "rgba(179,75,75,0.08)",
            borderRadius: "12px",
            textAlign: "center",
          }}
        >
          <p style={{ color: "var(--brick-dust)", fontWeight: 500, margin: 0 }}>
            <strong>Need immediate support?</strong> Call{" "}
            <a
              href="tel:1199"
              style={{
                color: "var(--brick-dust)",
                textDecoration: "underline",
              }}
            >
              1199
            </a>{" "}
            for crisis support
          </p>
        </div>

        <Link
          to="/"
          style={{
            display: "block",
            marginTop: "20px",
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
