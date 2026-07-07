// src/pages/student/ResourceDirectory.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaSearch,
  FaHeart,
  FaMoon,
  FaLeaf,
  FaExclamationTriangle,
  FaCheckCircle,
  FaInfoCircle,
  FaArrowRight,
  FaPhoneAlt,
  FaUserFriends,
  FaUniversity,
  FaClock,
} from "react-icons/fa";
import AssessmentLayout from "../../components/AssessmentLayout";
import Button from "../../components/Button";

const resources = [
  {
    id: 1,
    name: "SUMC Counselling Services",
    category: "counselling",
    description: "Professional counselling support for students.",
    contact: "+254 703 034 000",
    location: "SUMC, Madaraka Campus",
    hours: "Mon-Fri, 8:00-17:00",
    icon: <FaUserFriends size={24} color="#2a2a72" />,
  },
  {
    id: 2,
    name: "Peer Counsellors",
    category: "peer_support",
    description: "Trained student peers who offer compassionate support.",
    contact: "Visit the Dean of Students Office",
    location: "Student Affairs",
    hours: "Daily, 10:00-16:00",
    icon: <FaHeart size={24} color="#4a8b6b" />,
  },
  {
    id: 3,
    name: "Mindful Wellness Workshops",
    category: "wellness_workshop",
    description: "Student-led sessions on resilience and balance.",
    contact: "SUMC student wellness desk",
    location: "Various campus locations",
    hours: "Weekly calendar",
    icon: <FaLeaf size={24} color="#2a2a72" />,
  },
  {
    id: 4,
    name: "Crisis Helpline 1199",
    category: "crisis",
    description: "Immediate mental health crisis support.",
    contact: "1199 (toll free)",
    location: "Phone",
    hours: "24/7",
    icon: <FaExclamationTriangle size={24} color="#b34747" />,
  },
];

const categoryColors = {
  counselling: "#2a2a72",
  peer_support: "#4a8b6b",
  wellness_workshop: "#4a5568",
  crisis: "#b34747",
};

const categoryLabels = {
  counselling: "Counselling",
  peer_support: "Peer Support",
  wellness_workshop: "Wellness Workshop",
  crisis: "Crisis Support",
};

export default function ResourceDirectory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <AssessmentLayout>
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "20px 0",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #2a2a72 0%, #3a3a8a 100%)",
            borderRadius: "20px",
            padding: "32px 40px",
            color: "#fff",
            marginBottom: "28px",
          }}
        >
          <h1 style={{ margin: 0, fontSize: "28px", fontWeight: "600" }}>
            Resource Directory
          </h1>
          <p style={{ margin: "4px 0 0", opacity: 0.9, fontSize: "16px" }}>
            Find support services and wellness resources
          </p>
        </div>

        {/* Search and Filter */}
        <div
          style={{
            display: "flex",
            gap: "16px",
            flexWrap: "wrap",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              flex: 1,
              minWidth: "200px",
              display: "flex",
              alignItems: "center",
              background: "#fff",
              borderRadius: "10px",
              padding: "0 16px",
              border: "1px solid #e6e8f0",
            }}
          >
            <FaSearch color="#6b7280" />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: "12px 12px",
                border: "none",
                outline: "none",
                width: "100%",
                fontSize: "15px",
                background: "transparent",
              }}
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: "12px 16px",
              borderRadius: "10px",
              border: "1px solid #e6e8f0",
              fontSize: "15px",
              background: "#fff",
              cursor: "pointer",
              minWidth: "160px",
            }}
          >
            <option value="all">All Categories</option>
            <option value="counselling">Counselling</option>
            <option value="peer_support">Peer Support</option>
            <option value="wellness_workshop">Wellness Workshops</option>
            <option value="crisis">Crisis Support</option>
          </select>
        </div>

        {/* Results Count */}
        <p
          style={{
            color: "#6b7280",
            fontSize: "14px",
            marginBottom: "16px",
          }}
        >
          {filteredResources.length} resource
          {filteredResources.length !== 1 ? "s" : ""} found
        </p>

        {/* Resources Grid */}
        <div
          style={{
            display: "grid",
            gap: "16px",
          }}
        >
          {filteredResources.map((resource) => (
            <div
              key={resource.id}
              style={{
                padding: "24px",
                background: "#fff",
                borderRadius: "16px",
                boxShadow: "0 4px 12px rgba(42,42,114,0.08)",
                borderLeft: `4px solid ${categoryColors[resource.category]}`,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 8px 24px rgba(42,42,114,0.15)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(42,42,114,0.08)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "16px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "16px",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      padding: "12px",
                      borderRadius: "12px",
                      background: `${categoryColors[resource.category]}15`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {resource.icon}
                  </div>
                  <div>
                    <h3
                      style={{ margin: 0, color: "#1f2937", fontSize: "18px" }}
                    >
                      {resource.name}
                    </h3>
                    <span
                      style={{
                        display: "inline-block",
                        marginTop: "4px",
                        padding: "2px 10px",
                        borderRadius: "12px",
                        fontSize: "12px",
                        fontWeight: "500",
                        color: categoryColors[resource.category],
                        background: `${categoryColors[resource.category]}15`,
                      }}
                    >
                      {categoryLabels[resource.category]}
                    </span>
                    <p
                      style={{
                        margin: "8px 0 0",
                        color: "#6b7280",
                        fontSize: "14px",
                        lineHeight: "1.5",
                      }}
                    >
                      {resource.description}
                    </p>
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "8px",
                  marginTop: "16px",
                  paddingTop: "16px",
                  borderTop: "1px solid #e6e8f0",
                }}
              >
                {resource.contact && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "14px",
                      color: "#4a5568",
                    }}
                  >
                    <FaPhoneAlt size={14} color="#6b7280" />
                    <span>{resource.contact}</span>
                  </div>
                )}
                {resource.location && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "14px",
                      color: "#4a5568",
                    }}
                  >
                    <FaUniversity size={14} color="#6b7280" />
                    <span>{resource.location}</span>
                  </div>
                )}
                {resource.hours && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "14px",
                      color: "#4a5568",
                    }}
                  >
                    <FaClock size={14} color="#6b7280" />
                    <span>{resource.hours}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredResources.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              background: "#fff",
              borderRadius: "16px",
            }}
          >
            <FaInfoCircle
              size={48}
              color="#6b7280"
              style={{ opacity: 0.3, marginBottom: "16px" }}
            />
            <p style={{ color: "#6b7280", fontSize: "16px" }}>
              No resources found matching your search.
            </p>
          </div>
        )}

        {/* Crisis Button */}
        <div style={{ marginTop: "24px", textAlign: "center" }}>
          <Link to="/crisis">
            <Button
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                padding: "14px 32px",
                background: "#b34747",
              }}
              onMouseEnter={(e) => (e.target.style.background = "#9a3a3a")}
              onMouseLeave={(e) => (e.target.style.background = "#b34747")}
            >
              <FaExclamationTriangle size={18} />
              Need Immediate Support?
            </Button>
          </Link>
        </div>
      </div>
    </AssessmentLayout>
  );
}
