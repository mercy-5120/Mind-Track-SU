// src/pages/student/AssessmentCompletion.jsx
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCheckCircle, FaArrowRight } from "react-icons/fa";
import AssessmentLayout from "../../components/AssessmentLayout";
import Button from "../../components/Button";

export default function AssessmentCompletion() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  useEffect(() => {
    // If no result, redirect to dashboard after a moment
    if (!result) {
      const timer = setTimeout(() => {
        navigate("/student/dashboard");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [result, navigate]);

  if (!result) {
    return (
      <AssessmentLayout>
        <div
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            textAlign: "center",
            padding: "60px 20px",
          }}
        >
          <p style={{ color: "#6b7280" }}>
            No assessment data found. Redirecting...
          </p>
        </div>
      </AssessmentLayout>
    );
  }

  return (
    <AssessmentLayout>
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          textAlign: "center",
          padding: "40px 20px",
        }}
      >
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: "#d4edda",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
          }}
        >
          <FaCheckCircle size={48} color="#2f855a" />
        </div>

        <h1
          style={{
            color: "#2a2a72",
            fontSize: "32px",
            marginBottom: "12px",
          }}
        >
          Assessment Complete
        </h1>

        <p
          style={{
            color: "#6b7280",
            fontSize: "18px",
            marginBottom: "8px",
          }}
        >
          Your responses have been recorded.
        </p>

        <p
          style={{
            color: "#6b7280",
            fontSize: "16px",
            marginBottom: "32px",
          }}
        >
          Your personalized feedback is ready.
        </p>

        <div
          style={{
            padding: "20px",
            background: "#f8fafc",
            borderRadius: "12px",
            marginBottom: "32px",
          }}
        >
          <p
            style={{
              margin: 0,
              color: "#1f2937",
              fontSize: "14px",
            }}
          >
            Your overall wellness score:
          </p>
          <p
            style={{
              fontSize: "48px",
              fontWeight: "700",
              color:
                result.overallScore >= 70
                  ? "#2f855a"
                  : result.overallScore >= 40
                    ? "#4a5568"
                    : "#b34747",
              margin: "8px 0 0",
            }}
          >
            {result.overallScore}/100
          </p>
        </div>

        <Button
          onClick={() => navigate("/feedback", { state: { result } })}
          style={{
            padding: "14px 32px",
            fontSize: "16px",
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          View Feedback
          <FaArrowRight size={16} />
        </Button>
      </div>
    </AssessmentLayout>
  );
}
