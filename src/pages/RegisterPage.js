import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import ErrorBanner from '../components/ErrorBanner';
import { register } from '../api/auth';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [errors, setErrors] = useState({});
  const [banner, setBanner] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setBanner('');
    setLoading(true);
    try {
      await register(form);
      // Redirect to login with the email prefilled
      navigate('/login', { state: { email: form.email } });
    } catch (err) {
      setErrors(err.errors || {});
      setBanner(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center p-3">
      <div className="card shadow-sm" style={{ maxWidth: 480, width: '100%' }}>
        <div className="card-body p-4">
            <h5 className="mb-4 text-center">Digital Wallet</h5>
          <h3 className="mb-4 text-center">Create an account</h3>

          <ErrorBanner message={banner} />

          <form onSubmit={onSubmit}>
            <Input label="Name" name="name" value={form.name}
              onChange={onChange} error={errors.name?.[0]} />
            <Input label="Email" name="email" type="email" value={form.email}
              onChange={onChange} error={errors.email?.[0]} />
            <Input label="Password" name="password" type="password"
              value={form.password} onChange={onChange}
              error={errors.password?.[0]} />
            <Input label="Confirm password" name="password_confirmation"
              type="password" value={form.password_confirmation}
              onChange={onChange} />

            <Button type="submit" loading={loading} className="w-100">
              Register
            </Button>
          </form>

          <p className="text-center mt-3 mb-0 small">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}