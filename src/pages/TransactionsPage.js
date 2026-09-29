import { useEffect, useState } from 'react';
import Loading from '../components/Loading';
import ErrorBanner from '../components/ErrorBanner';
import EmptyState from '../components/EmptyState';
import TransactionRow from '../components/TransactionRow';
import { listTransactions } from '../api/transactions';
import { useGlobalValue } from '../context/useGlobalValue';

export default function TransactionsPage() {
  const user = useGlobalValue('user');
  const [txns, setTxns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await listTransactions();
      setTxns(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load transactions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <Loading message="Loading transactions..." />;
  if (error) return <ErrorBanner message={error} onRetry={load} />;
  if (txns.length === 0) {
    return <EmptyState message="No transactions yet." icon="🧾" />;
  }

  return (
    <div>
      <h4 className="mb-4">Transaction history</h4>
      <div className="list-group shadow-sm">
        {txns.map((txn) => (
          <TransactionRow key={txn.reference} txn={txn} currentUserId={user?.id} />
        ))}
      </div>
    </div>
  );
}