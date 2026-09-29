import { apiFetch } from './api';

export function getStatus() {
  return apiFetch('/settings/status', { token: null });
}