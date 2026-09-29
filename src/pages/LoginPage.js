import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import ErrorBanner from '../components/ErrorBanner';
import { login as loginApi, verifyOtp } from '../api/auth';
import { useSetGlobalValue } from '../context/useSetGlobalValue';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { set } = useSetGlobalValue();

  const [step, setStep] = useState('credentials'); // 'credentials' | 'otp'
  const [form, setForm] = useState({
    email: location.state?.email || '',
    password: '',
    code: '',
  });
  const [errors, setErrors] = useState({});
  const [banner, setBanner] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmitCredentials = async (e) => {
    e.preventDefault();
    setErrors({});
    setBanner('');
    setLoading(true);
    try {
      const res = await loginApi({ email: form.email, password: form.password });
      setInfo(res.message || 'Enter the 6-digit code.');
      setStep('otp');
    } catch (err) {
      setBanner(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const onSubmitOtp = async (e) => {
    e.preventDefault();
    setErrors({});
    setBanner('');
    setLoading(true);
    try {
      const res = await verifyOtp({ email: form.email, code: form.code });
      localStorage.setItem('token', res.access_token);
      set('token', res.access_token);
      set('user', res.user);
      navigate('/dashboard');
    } catch (err) {
      setErrors(err.errors || {});
      setBanner(err.message || 'Invalid code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center p-3">
      <div className="card shadow-sm" style={{ maxWidth: 480, width: '100%' }}>
        <div className="card-body p-4">
          <h3 className="mb-4 text-center">
            {step === 'credentials' ? 'Digital Wallet Log in' : 'Enter verification code'}
          </h3>

          <ErrorBanner message={banner} />
          {info && <div className="alert alert-info">{info}</div>}

          {step === 'credentials' ? (
            <form onSubmit={onSubmitCredentials}>
              <Input label="Email" name="email" type="email" value={form.email}
                onChange={onChange} error={errors.email?.[0]} />
              <Input label="Password" name="password" type="password"
                value={form.password} onChange={onChange}
                error={errors.password?.[0]} />

              <Button type="submit" loading={loading} className="w-100">
                Continue
              </Button>
            </form>
          ) : (
            <form onSubmit={onSubmitOtp}>
              <Input label="6-digit code" name="code" value={form.code}
                onChange={onChange} error={errors.code?.[0]}
                placeholder="e.g. 123456" />

              <Button type="submit" loading={loading} className="w-100">
                Verify
              </Button>

              <button
                type="button"
                className="btn btn-link w-100 mt-2"
                onClick={() => setStep('credentials')}
              >
                Back
              </button>
            </form>
          )}

          <p className="text-center mt-3 mb-0 small">
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}