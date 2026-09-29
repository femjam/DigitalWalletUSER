import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import ErrorBanner from '../components/ErrorBanner';
import { fundWallet } from '../api/wallets';

export default function FundPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    currency: 'NGN',
    amount: '',
    narration: '',
  });
  const [errors, setErrors] = useState({});
  const [banner, setBanner] = useState('');
  const [loading, setLoading] = useState(false);
  // One idempotency key per form session. Regenerated on success.
  const [idempotencyKey, setIdempotencyKey] = useState(() => crypto.randomUUID());

  const onChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setBanner('');
    setLoading(true);
    try {
      await fundWallet(form, idempotencyKey);
      // Regenerate key so next submission is a fresh operation
      setIdempotencyKey(crypto.randomUUID());
      navigate('/dashboard');
    } catch (err) {
      setErrors(err.errors || {});
      setBanner(err.message || 'Funding failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-8 col-lg-6">
        <div className="card shadow-sm">
          <div className="card-body p-4">
            <h4 className="mb-4">Fund your wallet</h4>

            <ErrorBanner message={banner} />

            <form onSubmit={onSubmit}>
              <div className="mb-3">
                <label className="form-label">Currency</label>
                <select
                  name="currency"
                  className="form-select"
                  value={form.currency}
                  onChange={onChange}
                >
                  <option value="NGN">NGN</option>
                  <option value="USD">USD</option>
                  <option value="USDT">USDT</option>
                </select>
                {errors.currency && (
                  <div className="text-danger small mt-1">{errors.currency[0]}</div>
                )}
              </div>

              <Input label="Amount" name="amount" value={form.amount}
                onChange={onChange} error={errors.amount?.[0]}
                placeholder="e.g. 5000.00" />

              <Input label="Narration (optional)" name="narration"
                value={form.narration} onChange={onChange}
                error={errors.narration?.[0]} />

              <Button type="submit" loading={loading} className="w-100">
                Fund wallet
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}