const API_BASE = import.meta.env.VITE_API_BASE || '/api/staff';

const getStaffIdQuery = () => {
  const id = sessionStorage.getItem('staffId');
  return id ? `${id}` : null;
};

const appendStaffId = (path) => {
  const staffId = getStaffIdQuery();
  if (!staffId) return path;
  return `${path}${path.includes('?') ? '&' : '?'}staffId=${encodeURIComponent(staffId)}`;
};

const happyFetch = async (url, options) => {
  const response = await fetch(url, options);
  if (!response.ok) {
    const error = new Error(`API request failed with status ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return response.json();
};

const fetchJson = async (path, fallback = []) => {
  try {
    return await happyFetch(`${API_BASE}${appendStaffId(path)}`);
  } catch (error) {
    console.warn('Staff API request failed:', error.message);
    return fallback;
  }
};

export async function getAlerts() {
  return await fetchJson('/alerts', []);
}

export async function getAlert(id) {
  return await fetchJson(`/alerts/${id}`, null);
}

export async function updateAlertStatus(id, status) {
  return await happyFetch(`${API_BASE}${appendStaffId(`/alerts/${id}/status`)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
}

export async function getReferrals() {
  return await fetchJson('/referrals', []);
}

export async function updateReferral(id, status, notes) {
  return await happyFetch(`${API_BASE}/referrals/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, notes }),
  });
}

export async function getFollowups(alertId) {
  if (!alertId) return [];
  return await fetchJson(`/followups/${alertId}`, []);
}

export async function createFollowUp(alertId, staffId, notes) {
  return await happyFetch(`${API_BASE}${appendStaffId('/followups')}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ alertId, staffId, notes }),
  });
}

export async function createReferral(payload) {
  return await happyFetch(`${API_BASE}${appendStaffId('/referrals')}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function getResources() {
  return await fetchJson('/resources', []);
}

export async function createResource(payload) {
  return await happyFetch(`${API_BASE}/resources`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function sendMessage(alertId, senderRole, recipient, content) {
  return await happyFetch(`${API_BASE}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ alertId, senderRole, recipient, content }),
  });
}

export async function getMessages(alertId) {
  return await fetchJson(`/messages/${alertId}`, []);
}

const guessRoleFromEmail = (email) => {
  const normalized = String(email || '').trim().toLowerCase();
  if (normalized.includes('peer')) return 'peer_counsellor';
  if (normalized.includes('dean')) return 'dean';
  return 'sumc_counsellor';
};

export async function loginStaff(email) {
  try {
    const response = await fetch(`${API_BASE}/login?email=${encodeURIComponent(email)}`);
    if (!response.ok) {
      throw new Error(`login failed: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn('Staff login backend unavailable:', error.message);
    const role = guessRoleFromEmail(email);
    return {
      staff_id: role === 'peer_counsellor' ? 2 : 1,
      email,
      name: role === 'peer_counsellor' ? 'Peer Counsellor' : role === 'dean' ? 'Dean' : 'SUMC Counsellor',
      role,
    };
  }
}
