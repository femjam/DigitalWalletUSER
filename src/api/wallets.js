import { apiFetch } from './api';

export function getWallets() {
  return apiFetch('/wallets');
}

export function fundWallet({ currency, amount, narration }, idempotencyKey) {
  return apiFetch('/wallets/fund', {
    method: 'POST',
    body: { currency, amount, narration },
    headers: { 'Idempotency-Key': idempotencyKey },
  });
}