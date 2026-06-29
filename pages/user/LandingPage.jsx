import React from "react";
import { Link } from "react-router-dom";
import Button from "../../components/Button";

export default function LandingPage() {
  return (
    <main>
      <section id="home" style={{ padding: "72px 20px 48px" }}>
        <div className="container">
          <div className="card" style={{ display: "grid", gap: "24px" }}>
            <div>
              <p className="label">Safe, anonymous support</p>
              <h1>Your well-being, tracked with privacy.</h1>
              <p style={{ marginTop: "16px", maxWidth: "680px", color: "var(--warm-gray)" }}>
                MindTrackSU blends gentle self-assessment, trusted resources, and confidential guidance so you can understand your mental health and move forward with confidence.
              </p>
            </div>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Link to="/assessment-intro">
                <Button>Start Anonymous Assessment</Button>
              </Link>
              <Link to="/create-account">
                <Button variant="secondary">Create Anonymous Account</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="about" style={{ padding: "0 20px 72px" }}>
        <div className="container">
          <div className="card">
            <p className="label">About MindTrackSU</p>
            <h2>Designed to help you track, understand, and respond to how you are feeling.</h2>
            <p style={{ marginTop: "12px", color: "var(--warm-gray)" }}>
              MindTrackSU is an anonymous companion for mental wellness. It helps you log patterns, uncover mood trends, and access care resources without sharing personal details.
            </p>
          </div>
        </div>
      </section>

      <section id="support" style={{ padding: "0 20px 72px" }}>
        <div className="container">
          <div className="card">
            <p className="label">Support & Resources</p>
            <h2>Find the help you need</h2>
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginTop: "24px" }}>
              <Link to="/resources" style={{ flex: "1 1 240px", textDecoration: "none" }}>
                <div style={{ padding: "20px", borderRadius: "16px", background: "rgba(212,184,180,0.2)" }}>
                  <h3 style={{ color: "var(--primary)" }}>Resource Directory</h3>
                  <p style={{ color: "var(--warm-gray)" }}>Explore support and well-being resources.</p>
                </div>
              </Link>
              <Link to="/crisis" style={{ flex: "1 1 240px", textDecoration: "none" }}>
                <div style={{ padding: "20px", borderRadius: "16px", background: "rgba(179,75,75,0.08)" }}>
                  <h3 style={{ color: "var(--brick-dust)" }}>Need immediate support?</h3>
                  <p style={{ color: "var(--warm-gray)" }}>Call 1199 or reach out for confidential support.</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
