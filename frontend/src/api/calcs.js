const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

export const fetchCalcs = async () => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}/api/calcs`, {
    method: 'GET',
    headers
  });

  if (!response.ok) {
    throw new Error('Failed to fetch calculations');
  }

  return response.json();
};

export const createRoot = async (startingNumber) => {
  const response = await fetch(`${API_BASE}/api/calcs/root`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ startingNumber })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create root');
  }

  return response.json();
};

export const createReply = async (parentId, operationType, rightOperand) => {
  const response = await fetch(`${API_BASE}/api/calcs/${parentId}/reply`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ operationType, rightOperand })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create reply');
  }

  return response.json();
};

export const deleteNode = async (nodeId) => {
  const response = await fetch(`${API_BASE}/api/calcs/${nodeId}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete node');
  }

  return response.json();
};

