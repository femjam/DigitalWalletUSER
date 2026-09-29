import { apiFetch } from './api';

export function register({ name, email, password, password_confirmation }) {
  return apiFetch('/auth/register', {
    method: 'POST',
    body: { name, email, password, password_confirmation },
    token: null,
  });
}

export function login({ email, password }) {
  return apiFetch('/auth/login', {
    method: 'POST',
    body: { email, password },
    token: null,
  });
}

export function verifyOtp({ email, code }) {
  return apiFetch('/auth/verify-otp', {
    method: 'POST',
    body: { email, code },
    token: null,
  });
}

export function me() {
  return apiFetch('/auth/me');
}

export function logout() {
  return apiFetch('/auth/logout', { method: 'POST' });
}

export function refresh() {
  return apiFetch('/auth/refresh', { method: 'POST' });
}