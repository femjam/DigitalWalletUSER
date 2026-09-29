import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BalanceCard from '../components/BalanceCard';
import Loading from '../components/Loading';
import ErrorBanner from '../components/ErrorBanner';
import { getWallets } from '../api/wallets';
import { getStatus } from '../api/settings';
import { useGlobalValue } from '../context/useGlobalValue';
import { useSetGlobalValue } from '../context/useSetGlobalValue';

export default function DashboardPage() {
  const user = useGlobalValue('user');
  const { set } = useSetGlobalValue();
  const [balances, setBalances] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [walletsRes, statusRes] = await Promise.all([
        getWallets(),
        getStatus().catch(() => null),
      ]);
      setBalances(walletsRes.balances);
      set('wallets', walletsRes.balances);
      setStatus(statusRes);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <Loading message="Loading dashboard..." />;
  if (error) return <ErrorBanner message={error} onRetry={load} />;

  const currencies = ['NGN', 'USD', 'USDT'];

  return (
    <div>
      <h4 className="mb-1">Hi, {user?.name || 'there'} 👋</h4>
      <p className="text-muted mb-4">Here's your wallet overview.</p>

      {status && status.transaction_allowed === 'inactive' && (
        <div className="alert alert-warning">
          Transactions are currently disabled platform-wide.
        </div>
      )}

      <div className="row g-3 mb-4">
        {currencies.map((c) => (
          <div key={c} className="col-12 col-md-4">
            <BalanceCard currency={c} balance={balances?.[c] ?? '0.00000000'} />
          </div>
        ))}
      </div>

      <div className="d-flex flex-wrap gap-2">
        <Link to="/fund" className="btn btn-primary">Fund wallet</Link>
        <Link to="/transfer" className="btn btn-outline-primary">Send money</Link>
        <Link to="/transactions" className="btn btn-outline-secondary">View history</Link>
      </div>
    </div>
  );
}