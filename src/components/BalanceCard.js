export default function BalanceCard({ currency, balance }) {
  const symbols = { NGN: '₦', USD: '$', USDT: '₮' };
  const symbol = symbols[currency] || '';
  const display = Number(balance).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="card h-100 shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center">
          <h6 className="text-muted mb-0">{currency}</h6>
          <span className="badge bg-secondary">{symbol}</span>
        </div>
        <h3 className="mt-3 mb-0">{display}</h3>
      </div>
    </div>
  );
}