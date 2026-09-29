import { apiFetch } from './api';

export function listTransactions() {
  return apiFetch('/transactions');
}

export function createTransfer(payload, idempotencyKey) {
  return apiFetch('/transactions', {
    method: 'POST',
    body: payload,
    headers: { 'Idempotency-Key': idempotencyKey },
  });
}

export function getTransaction(reference) {
  return apiFetch(`/transactions/${reference}`);
}