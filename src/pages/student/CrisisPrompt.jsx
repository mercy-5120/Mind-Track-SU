import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaPhoneAlt } from "react-icons/fa";
import Button from "../../components/Button";
import { getCurrentStudent, saveCrisisAlert } from "../../utils/studentSession";

export default function CrisisPrompt() {
  const navigate = useNavigate();
  const currentStudent = getCurrentStudent();
  const [showForm, setShowForm] = useState(false);
  const [contact, setContact] = useState("");

  const handleSubmit = () => {
    if (contact.trim()) {
      saveCrisisAlert(currentStudent, contact);
      alert("A counsellor will contact you within 24 hours.");
      setContact("");
      setShowForm(false);
    } else {
      alert("Please enter your contact information");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card" style={{ textAlign: "center" }}>
          <h1 style={{ marginBottom: "16px" }}>We are here for you</h1>
          <p style={{ marginBottom: "24px", color: "var(--warm-gray)" }}>
            If this feels overwhelming, you do not have to carry it alone. A
            caring person can help you through the next step.
          </p>
          {!showForm ? (
            <>
              <Button full onClick={() => setShowForm(true)}>
                Yes, I would like a counsellor to contact me
              </Button>
              <Button
                variant="secondary"
                full
                style={{ marginTop: "12px" }}
                onClick={() => alert("You can call 1199 for immediate support")}
              >
                No, I will manage on my own
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
                onClick={handleSubmit}
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
            <a
              href="tel:1199"
              style={{
                fontWeight: 600,
                color: "var(--brick-dust)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                textDecoration: "none",
              }}
            >
              <FaPhoneAlt /> Call 1199 for immediate support
            </a>
          </div>
          <p
            style={{
              marginTop: "16px",
              fontSize: "0.85rem",
              color: "var(--warm-gray)",
            }}
          >
            Your contact details will remain confidential and only used to
            connect you with support.
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
