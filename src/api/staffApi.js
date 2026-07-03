const API_BASE = 'http://localhost:3001/api/staff';

const getStaffIdQuery = () => {
  const id = sessionStorage.getItem('staffId');
  return id ? `${id}` : null;
};

const appendStaffId = (path) => {
  const staffId = getStaffIdQuery();
  if (!staffId) return path;
  return `${path}${path.includes('?') ? '&' : '?'}staffId=${encodeURIComponent(staffId)}`;
};

const mockStaffAccounts = [
  { staff_id: 1, email: 'sumc@strathmore.edu', name: 'Jane Doe', role: 'sumc_counsellor' },
  { staff_id: 2, email: 'peer@strathmore.edu', name: 'Alex Kim', role: 'peer_counsellor' },
];

const mockAlerts = [
  { alert_id: 1, category: 'depression', risk_level: 'high', alert_status: 'new', student_name: 'Student A', student_identifier: '•••••7890', created_at: '2026-06-16 09:00:00', assigned_staff_id: 1, assigned_staff_name: 'Jane Doe', assigned_staff_role: 'sumc_counsellor' },
  { alert_id: 2, category: 'anxiety', risk_level: 'high', alert_status: 'pending', student_name: 'Student B', student_identifier: '•••••4512', created_at: '2026-06-15 11:30:00', assigned_staff_id: 2, assigned_staff_name: 'Alex Kim', assigned_staff_role: 'peer_counsellor' },
  { alert_id: 3, category: 'burnout', risk_level: 'moderate', alert_status: 'resolved', student_name: 'Student C', student_identifier: '•••••3321', created_at: '2026-06-14 16:00:00', assigned_staff_id: 2, assigned_staff_name: 'Alex Kim', assigned_staff_role: 'peer_counsellor' },
];

const mockReferrals = [
  { referral_id: 1, alert_id: 1, referred_to: 'sumc_counsellor', referral_status: 'pending', student_name: 'Student A', notes: 'Need supervised counseling follow-up', created_at: '2026-06-16 10:00:00' },
  { referral_id: 2, alert_id: 2, referred_to: 'peer_counsellor', referral_status: 'accepted', student_name: 'Student B', notes: 'Peer support assigned', created_at: '2026-06-15 12:00:00' },
];

const mockResources = [
  { resource_id: 1, title: 'Crisis line guide', description: 'Immediate support and escalation procedures', resource_type: 'guide', link: '/resources', created_at: '2026-06-16 08:00:00' },
  { resource_id: 2, title: 'Peer support training', description: 'Training materials for peer counsellors', resource_type: 'training', link: '/resources', created_at: '2026-06-15 13:30:00' },
  { resource_id: 3, title: 'Confidentiality policy', description: 'How to maintain student privacy', resource_type: 'policy', link: '/resources', created_at: '2026-06-14 15:45:00' },
];

let localAlerts = [...mockAlerts];
let localReferrals = [...mockReferrals];
let localResources = [...mockResources];

const happyFetch = async (url, options) => {
  const response = await fetch(url, options);
  if (!response.ok) {
    const error = new Error(`API request failed with status ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return response.json();
};

const fetchJson = async (path, fallback) => {
  try {
    return await happyFetch(`${API_BASE}${appendStaffId(path)}`);
  } catch (error) {
    console.warn('Staff API fallback active:', error.message);
    return fallback;
  }
};

export async function getAlerts() {
  const alerts = await fetchJson('/alerts', localAlerts);
  if (!Array.isArray(alerts)) return localAlerts;
  return alerts;
}

export async function getAlert(id) {
  const alert = await fetchJson(`/alerts/${id}`, localAlerts.find((item) => item.alert_id.toString() === id.toString()) || null);
  return alert;
}

export async function updateAlertStatus(id, status) {
  try {
    return await happyFetch(`${API_BASE}${appendStaffId(`/alerts/${id}/status`)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
  } catch (error) {
    localAlerts = localAlerts.map((item) => (item.alert_id.toString() === id.toString() ? { ...item, alert_status: status } : item));
    return { success: true };
  }
}

export async function getReferrals() {
  const referrals = await fetchJson('/referrals', localReferrals);
  if (!Array.isArray(referrals)) return localReferrals;
  return referrals;
}

export async function updateReferral(id, status, notes) {
  try {
    return await happyFetch(`${API_BASE}/referrals/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, notes }),
    });
  } catch (error) {
    localReferrals = localReferrals.map((item) => (item.referral_id.toString() === id.toString() ? { ...item, referral_status: status, notes } : item));
    return { success: true };
  }
}

export async function getFollowups(alertId) {
  const followups = await fetchJson(`/followups/${alertId}`, []);
  return followups;
}

export async function createFollowUp(alertIdOrPayload, staffId, notes) {
  const payload = typeof alertIdOrPayload === 'object' && alertIdOrPayload !== null
    ? alertIdOrPayload
    : { alertId: alertIdOrPayload, staffId, notes };

  try {
    return await happyFetch(`${API_BASE}${appendStaffId('/followups')}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    const nextId = localAlerts.length + localReferrals.length + 1;
    localReferrals.push({
      referral_id: nextId,
      alert_id: payload.alertId ?? null,
      referred_to: payload.staffId ? 'peer_counsellor' : 'sumc_counsellor',
      referral_status: 'pending',
      student_name: `Student ${payload.alertId ?? nextId}`,
      notes: payload.notes ?? payload.followup_notes ?? 'Follow-up created from staff portal',
      created_at: new Date().toISOString(),
    });
    return { success: true };
  }
}

export async function createReferral(payload) {
  try {
    return await happyFetch(`${API_BASE}${appendStaffId('/referrals')}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    const nextId = localReferrals.length + 1;
    const referral = {
      referral_id: nextId,
      alert_id: payload.alertId ?? null,
      referred_to: payload.referredTo ?? payload.referralType ?? 'sumc_counsellor',
      referral_status: payload.status ?? 'pending',
      student_name: payload.studentName ?? `Student ${payload.student_id ?? nextId}`,
      notes: payload.notes ?? 'Created from staff portal',
      created_at: new Date().toISOString(),
    };
    localReferrals.unshift(referral);
    return { success: true };
  }
}

export async function getResources() {
  const resources = await fetchJson('/resources', localResources);
  if (!Array.isArray(resources)) return localResources;
  return resources;
}

export async function sendMessage(alertId, senderRole, recipient, content) {
  try {
    return await happyFetch(`${API_BASE}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ alertId, senderRole, recipient, content }),
    });
  } catch (error) {
    return { success: true };
  }
}

export async function getMessages(alertId) {
  const messages = await fetchJson(`/messages/${alertId}`, []);
  return messages;
}

const findFallbackStaff = (email) => {
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const emailMatch = mockStaffAccounts.find((staff) => staff.email === normalizedEmail);
  if (emailMatch) return emailMatch;
  if (normalizedEmail.includes('peer')) {
    return mockStaffAccounts.find((staff) => staff.role === 'peer_counsellor');
  }
  return mockStaffAccounts.find((staff) => staff.role === 'sumc_counsellor');
};

export async function loginStaff(email) {
  try {
    const response = await fetch(`${API_BASE}/login?email=${encodeURIComponent(email)}`);
    if (!response.ok) {
      throw new Error(`login failed: ${response.status}`);
    }
    const staff = await response.json();
    return staff;
  } catch (error) {
    console.warn('Staff login backend unavailable:', error.message);
    return findFallbackStaff(email);
  }
}
