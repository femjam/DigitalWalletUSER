import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Loading from '../components/Loading';
import ErrorBanner from '../components/ErrorBanner';
import { getTransaction } from '../api/transactions';

export default function TransactionDetailPage() {
  const { reference } = useParams();
  const [txn, setTxn] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getTransaction(reference);
      setTxn(res);
    } catch (err) {
      setError(err.message || 'Failed to load transaction.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reference]);

  if (loading) return <Loading message="Loading transaction..." />;
  if (error) return <ErrorBanner message={error} onRetry={load} />;
  if (!txn) return null;

  const statusBadge = {
    completed: 'bg-success',
    failed: 'bg-danger',
    pending: 'bg-warning text-dark',
  }[txn.status] || 'bg-secondary';

  const Row = ({ label, value }) => (
    <div className="d-flex justify-content-between border-bottom py-2">
      <span className="text-muted">{label}</span>
      <span className="fw-semibold text-end">{value ?? '—'}</span>
    </div>
  );

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-8 col-lg-6">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="mb-0">Transaction details</h4>
          <Link to="/transactions" className="btn btn-sm btn-outline-secondary">
            Back
          </Link>
        </div>

        <div className="card shadow-sm">
          <div className="card-body">
            <Row label="Reference" value={txn.reference} />
            <Row label="Status"
              value={<span className={`badge ${statusBadge}`}>{txn.status}</span>} />
            <Row label="Amount"
              value={`${Number(txn.amount).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })} ${txn.currency}`} />
            <Row label="Sender" value={txn.sender?.name ?? 'Funding'} />
            <Row label="Receiver" value={txn.receiver?.name ?? '—'} />
            <Row label="Narration" value={txn.narration} />
            {txn.failure_reason && <Row label="Failure reason" value={txn.failure_reason} />}
            <Row label="Date"
              value={new Date(txn.created_at).toLocaleString()} />
          </div>
        </div>
      </div>
    </div>
  );
}