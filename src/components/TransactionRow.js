import { Link } from 'react-router-dom';

export default function TransactionRow({ txn, currentUserId }) {
  const isDebit = txn.sender && txn.sender.id === currentUserId;
  const sign = isDebit ? '-' : '+';
  const color = isDebit ? 'text-danger' : 'text-success';

  const statusBadge = {
    completed: 'bg-success',
    failed: 'bg-danger',
    pending: 'bg-warning text-dark',
  }[txn.status] || 'bg-secondary';

  return (
    <Link
      to={`/transactions/${txn.reference}`}
      className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
    >
      <div>
        <div className="fw-semibold">
          {isDebit ? `To ${txn.receiver?.name ?? '—'}` : `From ${txn.sender?.name ?? 'Funding'}`}
        </div>
        <small className="text-muted">
          {new Date(txn.created_at).toLocaleString()}
        </small>
      </div>
      <div className="text-end">
        <div className={`fw-bold ${color}`}>
          {sign}
          {Number(txn.amount).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}{' '}
          {txn.currency}
        </div>
        <span className={`badge ${statusBadge}`}>{txn.status}</span>
      </div>
    </Link>
  );
}