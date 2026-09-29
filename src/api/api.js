const BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';

/**
 * Single fetch wrapper. Every call goes through here.
 * - Attaches the JWT if provided or found in localStorage.
 * - Parses JSON.
 * - Throws a structured error on non-2xx.
 */
export async function apiFetch(path, options = {}) {
  const token = options.token !== undefined
    ? options.token
    : localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(options.headers || {}),
  };

  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${BASE_URL}${path}`, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const error = new Error(data?.message || 'Request failed.');
    error.status = response.status;
    error.code = data?.code || 'ERROR';
    error.errors = data?.errors || null;
    throw error;
  }

  return data;
}