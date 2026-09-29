import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import ErrorBanner from '../components/ErrorBanner';
import { createTransfer } from '../api/transactions';

export default function TransferPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    recipient_email: '',
    currency: 'NGN',
    amount: '',
    narration: '',
  });
  const [errors, setErrors] = useState({});
  const [banner, setBanner] = useState('');
  const [duplicate, setDuplicate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [idempotencyKey, setIdempotencyKey] = useState(() => crypto.randomUUID());

  const onChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = async (e, confirmDuplicate = false) => {
    e?.preventDefault();
    setErrors({});
    setBanner('');
    setLoading(true);
    try {
      const payload = { ...form };
      if (confirmDuplicate) payload.confirm_duplicate = true;
      await createTransfer(payload, idempotencyKey);
      setIdempotencyKey(crypto.randomUUID());
      navigate('/transactions');
    } catch (err) {
      if (err.code === 'POSSIBLE_DUPLICATE') {
        setDuplicate(true);
        setBanner(err.message);
      } else {
        setErrors(err.errors || {});
        setBanner(err.message || 'Transfer failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-8 col-lg-6">
        <div className="card shadow-sm">
          <div className="card-body p-4">
            <h4 className="mb-4">Send money</h4>

            <ErrorBanner message={banner} />

            {duplicate && (
              <div className="alert alert-warning">
                <p className="mb-2">A similar transfer was just made.</p>
                <button
                  className="btn btn-sm btn-warning"
                  onClick={() => onSubmit(null, true)}
                >
                  Yes, send anyway
                </button>
              </div>
            )}

            <form onSubmit={onSubmit}>
              <Input label="Recipient email" name="recipient_email"
                type="email" value={form.recipient_email}
                onChange={onChange} error={errors.recipient_email?.[0]} />

              <div className="mb-3">
                <label className="form-label">Currency</label>
                <select name="currency" className="form-select"
                  value={form.currency} onChange={onChange}>
                  <option value="NGN">NGN</option>
                  <option value="USD">USD</option>
                  <option value="USDT">USDT</option>
                </select>
              </div>

              <Input label="Amount" name="amount" value={form.amount}
                onChange={onChange} error={errors.amount?.[0]}
                placeholder="e.g. 1000.00" />

              <Input label="Narration (optional)" name="narration"
                value={form.narration} onChange={onChange} />

              <Button type="submit" loading={loading} className="w-100">
                Send
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}