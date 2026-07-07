// src/api/staffApi.js
const API_BASE = import.meta.env.VITE_API_BASE || "/api/staff";

const getStaffIdQuery = () => {
  const id = sessionStorage.getItem("staffId");
  return id ? `${id}` : null;
};

const appendStaffId = (path) => {
  const staffId = getStaffIdQuery();
  if (!staffId) return path;
  return `${path}${path.includes("?") ? "&" : "?"}staffId=${encodeURIComponent(staffId)}`;
};

const happyFetch = async (url, options) => {
  const response = await fetch(url, options);
  if (!response.ok) {
    const error = new Error(
      `API request failed with status ${response.status}`,
    );
    error.status = response.status;
    throw error;
  }
  return response.json();
};

const fetchJson = async (path, fallback = []) => {
  try {
    return await happyFetch(`${API_BASE}${appendStaffId(path)}`);
  } catch (error) {
    console.warn("Staff API request failed:", error.message);
    return fallback;
  }
};

// =====================================================
// ALERT FUNCTIONS
// =====================================================

export async function getAlerts() {
  try {
    const response = await fetch(`${API_BASE}/alerts`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("[getAlerts] Data received:", data);
    return data;
  } catch (error) {
    console.error("[getAlerts] Error:", error);
    return [];
  }
}

export async function getAlert(id) {
  try {
    console.log("[getAlert] Fetching alert:", id);
    const response = await fetch(`${API_BASE}/alerts/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("[getAlert] Error:", error);
    return null;
  }
}

export async function updateAlertStatus(id, status) {
  try {
    console.log("[updateAlertStatus] Updating alert:", id, "to:", status);
    const response = await fetch(`${API_BASE}/alerts/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update alert status");
    }

    return await response.json();
  } catch (error) {
    console.error("[updateAlertStatus] Error:", error);
    throw error;
  }
}

// =====================================================
// CRISIS ALERT FUNCTIONS
// =====================================================

export async function getCrisisAlerts() {
  try {
    const response = await fetch(`${API_BASE}/crisis-alerts`);
    if (!response.ok) {
      throw new Error("Failed to fetch crisis alerts");
    }
    const data = await response.json();
    return data.alerts || [];
  } catch (error) {
    console.warn("Error fetching crisis alerts:", error);
    return [];
  }
}

export async function updateCrisisAlertStatus(alertId, status) {
  try {
    console.log(
      "[updateCrisisAlertStatus] Updating crisis alert:",
      alertId,
      "to:",
      status,
    );
    const response = await fetch(
      `${API_BASE}/crisis-alerts/${alertId}/status`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Failed to update crisis alert status",
      );
    }

    return await response.json();
  } catch (error) {
    console.error("[updateCrisisAlertStatus] Error:", error);
    throw error;
  }
}

// =====================================================
// REFERRAL FUNCTIONS
// =====================================================

export async function getReferrals() {
  try {
    const response = await fetch(`${API_BASE}/referrals`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("[getReferrals] Data received:", data);
    return data;
  } catch (error) {
    console.error("[getReferrals] Error:", error);
    return [];
  }
}

// Helper function to validate and map status for database
const validateAndMapStatus = (status) => {
  // Map 'acknowledged' to 'accepted' for database compatibility
  if (status === "acknowledged") {
    return "accepted";
  }
  return status;
};

export async function updateReferral(id, status, notes) {
  try {
    // Map 'acknowledged' to 'accepted' before sending to API
    const mappedStatus = validateAndMapStatus(status);

    console.log(
      "[updateReferral] Updating referral:",
      id,
      "to status:",
      mappedStatus,
      "(original status:",
      status,
      ")",
    );

    const response = await fetch(`${API_BASE}/referrals/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: mappedStatus, notes }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update referral status");
    }

    return await response.json();
  } catch (error) {
    console.error("[updateReferral] Error:", error);
    throw error;
  }
}

export async function createReferral(payload) {
  try {
    // Map 'acknowledged' to 'accepted' in payload if present
    if (payload.referral_status === "acknowledged") {
      payload.referral_status = "accepted";
    }

    console.log("[createReferral] Creating referral:", payload);
    const response = await fetch(`${API_BASE}/referrals`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create referral");
    }

    return await response.json();
  } catch (error) {
    console.error("[createReferral] Error:", error);
    throw error;
  }
}

// =====================================================
// FOLLOW-UP FUNCTIONS
// =====================================================

export async function getFollowups(alertId) {
  if (!alertId) return [];
  return await fetchJson(`/followups/${alertId}`, []);
}

export async function createFollowUp(alertId, staffId, notes) {
  return await happyFetch(`${API_BASE}${appendStaffId("/followups")}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ alertId, staffId, notes }),
  });
}

// =====================================================
// RESOURCE FUNCTIONS
// =====================================================

export async function getResources() {
  try {
    const response = await fetch(`${API_BASE}/resources`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("[getResources] Data received:", data);
    return data;
  } catch (error) {
    console.error("[getResources] Error:", error);
    return [];
  }
}

export async function createResource(payload) {
  return await happyFetch(`${API_BASE}/resources`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

// =====================================================
// MESSAGE FUNCTIONS
// =====================================================

export async function sendMessage(alertId, senderRole, recipient, content) {
  return await happyFetch(`${API_BASE}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ alertId, senderRole, recipient, content }),
  });
}

export async function getMessages(alertId) {
  return await fetchJson(`/messages/${alertId}`, []);
}

// =====================================================
// STAFF LOGIN
// =====================================================

const guessRoleFromEmail = (email) => {
  const normalized = String(email || "")
    .trim()
    .toLowerCase();
  if (normalized.includes("peer")) return "peer_counsellor";
  if (normalized.includes("dean")) return "dean";
  return "sumc_counsellor";
};

export async function loginStaff(email, password) {
  try {
    const response = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = new Error(`login failed: ${response.status}`);
      error.status = response.status;
      throw error;
    }

    return await response.json();
  } catch (error) {
    if (error.status === 401 || error.status === 404) {
      throw error;
    }
    console.warn("Staff login backend unavailable:", error.message);
    const role = guessRoleFromEmail(email);
    return {
      staff_id: role === "peer_counsellor" ? 2 : 1,
      email,
      name:
        role === "peer_counsellor"
          ? "Peer Counsellor"
          : role === "dean"
            ? "Dean"
            : "SUMC Counsellor",
      role,
    };
  }
}

// =====================================================
// EXPORT ALL FUNCTIONS
// =====================================================

export default {
  getAlerts,
  getAlert,
  updateAlertStatus,
  getCrisisAlerts,
  updateCrisisAlertStatus,
  getReferrals,
  updateReferral,
  createReferral,
  getFollowups,
  createFollowUp,
  getResources,
  createResource,
  sendMessage,
  getMessages,
  loginStaff,
};
