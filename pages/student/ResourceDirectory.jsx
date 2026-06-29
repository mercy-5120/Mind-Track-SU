import React, { useState } from "react";
import { Link } from "react-router-dom";

const resources = [
  {
    id: 1,
    name: "SUMC Counselling Services",
    category: "Counselling",
    description: "Professional counselling for students",
    contact: "+254 703 034 000",
    location: "SUMC, Madaraka Campus",
  },
  {
    id: 2,
    name: "Peer Counsellors",
    category: "Peer Support",
    description: "Trained student peer counsellors",
    contact: "Through SUMC reception",
    location: "Dean of Students Office",
  },
  {
    id: 3,
    name: "Mental Health Club",
    category: "Wellness Workshop",
    description: "Student-led mental health advocacy group",
    contact: "SUMHC Instagram page",
    location: "Various campus locations",
  },
  {
    id: 4,
    name: "Crisis Helpline 1199",
    category: "Crisis",
    description: "24/7 mental health crisis support",
    contact: "1199 (toll free)",
    location: "Phone",
  },
];

export default function ResourceDirectory() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const filtered = resources.filter((r) => {
    if (filter !== "All" && r.category !== filter) return false;
    if (search && !r.name.toLowerCase().includes(search.toLowerCase()))
      return false;
    return true;
  });

  return (
    <div className="auth-page" style={{ padding: "20px" }}>
      <div className="auth-container" style={{ maxWidth: "700px" }}>
        <div className="auth-card">
          <h2 style={{ marginBottom: "24px" }}>Support Resources</h2>
          <input
            type="text"
            placeholder="Search resources..."
            className="input-field"
            style={{ marginBottom: "16px" }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div
            style={{
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
              marginBottom: "24px",
            }}
          >
            {[
              "All",
              "Counselling",
              "Peer Support",
              "Crisis",
              "Wellness Workshop",
            ].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                style={{
                  padding: "6px 16px",
                  borderRadius: "20px",
                  border:
                    filter === cat
                      ? "2px solid var(--primary)"
                      : "1px solid var(--dusty-rose)",
                  background: filter === cat ? "var(--primary)" : "transparent",
                  color: filter === cat ? "#fff" : "var(--text)",
                  cursor: "pointer",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            {filtered.map((r) => (
              <div
                key={r.id}
                style={{
                  background: "rgba(212,184,180,0.2)",
                  borderRadius: "16px",
                  padding: "16px",
                }}
              >
                <h3 style={{ color: "var(--primary)" }}>{r.name}</h3>
                <span
                  style={{
                    background: "var(--secondary)",
                    color: "#fff",
                    padding: "2px 12px",
                    borderRadius: "20px",
                    fontSize: "0.7rem",
                    display: "inline-block",
                    marginBottom: "8px",
                  }}
                >
                  {r.category}
                </span>
                <p style={{ color: "var(--warm-gray)" }}>{r.description}</p>
                <p style={{ color: "var(--warm-gray)", fontSize: "0.9rem" }}>
                  📞 {r.contact}
                </p>
                <p style={{ color: "var(--warm-gray)", fontSize: "0.9rem" }}>
                  📍 {r.location}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
