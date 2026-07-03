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
              backdropFilter: "blur(10px)",
              backgroundImage: `linear-gradient(120deg, rgba(255,255,255,0.60), rgba(255,255,255,0.40)), url(${landingBackground})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
              border: "1px solid rgba(255,255,255,0.5)",
            }}
          >
            <div style={{ maxWidth: "680px" }}>
              <p className="label">Safe, anonymous support</p>
              <h1>Your well-being, tracked with privacy</h1>
              <p
                style={{
                  marginTop: "16px",
                  color: "black",
                  fontSize: "1.05rem",
                }}
              >
                MindTrackSU helps you reflect on your mental wellness,
                understand your patterns, and reach the right support without
                sharing personal details.
              </p>
            </div>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Link to="/create-account">
                <Button variant="secondary">Create Account</Button>
              </Link>
              <Link to="/assessment-intro">
                <Button>
                  Continue Anonymously <FaArrowRight />
                </Button>
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
                      style={{ color: "#161617", fontSize: "0.95rem" }}
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
                wellness in a private, low-pressure way. Students can choose to
                complete the assessment anonymously or create an account to keep
                a personal history of their check-ins and scores.
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
