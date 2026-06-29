import React, { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/Button";

export default function CrisisPrompt() {
  const [showForm, setShowForm] = useState(false);
  const [contact, setContact] = useState("");

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card" style={{ textAlign: "center" }}>
          <h1 style={{ marginBottom: "16px" }}>We're Here for You</h1>
          <p style={{ marginBottom: "24px", color: "var(--warm-gray)" }}>
            Your responses indicate you might be going through a difficult time.
            You don't have to manage this alone.
          </p>
          {!showForm ? (
            <>
              <Button full onClick={() => setShowForm(true)}>
                Yes, I'd like a counsellor to contact me
              </Button>
              <Button
                variant="secondary"
                full
                style={{ marginTop: "12px" }}
                onClick={() => alert("You can call 1199 for immediate support")}
              >
                No, I'll manage on my own
              </Button>
            </>
          ) : (
            <div style={{ marginTop: "16px" }}>
              <input
                type="text"
                placeholder="Enter your email or phone number"
                className="input-field"
                style={{ marginBottom: "12px" }}
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />
              <Button
                full
                onClick={() =>
                  alert("Counsellor will contact you within 24 hours")
                }
              >
                Submit
              </Button>
            </div>
          )}
          <div
            style={{
              marginTop: "24px",
              padding: "16px",
              background: "rgba(179,75,75,0.08)",
              borderRadius: "12px",
            }}
          >
            <p style={{ fontWeight: 600, color: "var(--brick-dust)" }}>
              📞 Call 1199 for immediate support
            </p>
          </div>
          <p
            style={{
              marginTop: "16px",
              fontSize: "0.85rem",
              color: "var(--warm-gray)",
            }}
          >
            Your contact details will be kept confidential. Only used to connect
            you with support.
          </p>
          <Link
            to="/"
            style={{
              display: "block",
              marginTop: "16px",
              color: "var(--primary)",
            }}
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
