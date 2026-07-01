import React from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaCheckCircle,
  FaCompass,
  FaHeartbeat,
  FaShieldAlt,
} from "react-icons/fa";
import Button from "../../components/Button";
import landingBackground from "../../Assets/LandingPageBackground.png";
import aboutBackground from "../../Assets/AboutBackground.png";

const features = [
  {
    icon: <FaShieldAlt />,
    title: "Private check-ins",
    text: "Your responses stay anonymous and protected.",
  },
  {
    icon: <FaHeartbeat />,
    title: "Tailored guidance",
    text: "We highlight support options based on how you feel.",
  },
  {
    icon: <FaCompass />,
    title: "Trusted resources",
    text: "Find counselling, peer support, and crisis help in one place.",
  },
];

const quickResources = [
  {
    title: "Counselling",
    text: "Book a session with student support services.",
    link: "/resources",
  },
  {
    title: "Peer Support",
    text: "Connect with trained peers who understand the pressure.",
    link: "/resources",
  },
  {
    title: "Crisis Help",
    text: "Reach out immediately if you need urgent support.",
    link: "/crisis",
  },
];

export default function LandingPage() {
  return (
    <main>
      <section
        id="home"
        style={{
          padding: "56px 20px 40px",
          background:
            "linear-gradient(135deg, rgba(42,42,114,0.07), rgba(212,184,180,0.12))",
        }}
      >
        <div className="container">
          <div
            className="card"
            style={{
              display: "grid",
              gap: "24px",
              background: "rgba(255,255,255,0.78)",
              backdropFilter: "blur(14px)",
              backgroundImage: `linear-gradient(120deg, rgba(255,255,255,0.88), rgba(255,255,255,0.62)), url(${landingBackground})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              border: "1px solid rgba(255,255,255,0.5)",
            }}
          >
            <div style={{ maxWidth: "680px" }}>
              <p className="label">Safe, anonymous support</p>
              <h1>Your well-being, tracked with privacy</h1>
              <p
                style={{
                  marginTop: "16px",
                  color: "var(--warm-gray)",
                  fontSize: "1.05rem",
                }}
              >
                MindTrackSU helps you reflect on your mental wellness,
                understand your patterns, and reach the right support without
                sharing personal details.
              </p>
            </div>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Link to="/assessment-intro">
                <Button>
                  Start Anonymous Assessment <FaArrowRight />
                </Button>
              </Link>
              <Link to="/create-account">
                <Button variant="secondary">Create Anonymous Account</Button>
              </Link>
              <Link to="/staff/login">
                <Button variant="secondary">Staff Login</Button>
              </Link>
            </div>
            <div
              style={{
                display: "grid",
                gap: "12px",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              }}
            >
              {features.map((feature) => (
                <div
                  key={feature.title}
                  style={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "flex-start",
                    color: "var(--text)",
                  }}
                >
                  <span
                    style={{
                      color: "var(--primary)",
                      fontSize: "1.1rem",
                      marginTop: "2px",
                    }}
                  >
                    {feature.icon}
                  </span>
                  <div>
                    <h3 style={{ fontSize: "1rem", marginBottom: "4px" }}>
                      {feature.title}
                    </h3>
                    <p
                      style={{ color: "var(--warm-gray)", fontSize: "0.95rem" }}
                    >
                      {feature.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="about" style={{ padding: "56px 20px 24px" }}>
        <div className="container">
          <div
            className="card"
            style={{
              display: "grid",
              gap: "24px",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              alignItems: "center",
            }}
          >
            <div>
              <p className="label">About MindTrackSU</p>
              <h2>Designed to support your calm, clarity, and next step.</h2>
              <p style={{ marginTop: "12px", color: "var(--warm-gray)" }}>
                This space helps university students check in with their mental
                wellness in a private, low-pressure way. It combines a short
                anonymous assessment with thoughtful resources so support feels
                approachable, not overwhelming.
              </p>
            </div>
            <img
              src={aboutBackground}
              alt="Student support illustration"
              style={{
                width: "100%",
                borderRadius: "18px",
                boxShadow: "0 10px 30px rgba(45,45,52,0.14)",
              }}
            />
          </div>
        </div>
      </section>

      <section id="resources" style={{ padding: "24px 20px 56px" }}>
        <div className="container">
          <div className="card">
            <p className="label">Support</p>
            <h2>Find the right support quickly</h2>
            <div
              style={{
                display: "grid",
                gap: "16px",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                marginTop: "24px",
              }}
            >
              {quickResources.map((item) => (
                <Link
                  key={item.title}
                  to={item.link}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div
                    style={{
                      padding: "20px",
                      borderRadius: "18px",
                      background: "rgba(212,184,180,0.18)",
                      border: "1px solid rgba(42,42,114,0.08)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "8px",
                      }}
                    >
                      <FaCheckCircle style={{ color: "var(--secondary)" }} />
                      <h3
                        style={{ color: "var(--primary)", fontSize: "1.05rem" }}
                      >
                        {item.title}
                      </h3>
                    </div>
                    <p
                      style={{ color: "var(--warm-gray)", fontSize: "0.95rem" }}
                    >
                      {item.text}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
