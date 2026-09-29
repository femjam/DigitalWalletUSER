import { Link, useNavigate } from 'react-router-dom';
import { useGlobalValue } from '../context/useGlobalValue';
import { useSetGlobalValue } from '../context/useSetGlobalValue';
import { logout as logoutApi } from '../api/auth';

export default function NavBar() {
  const user = useGlobalValue('user');
  const { remove } = useSetGlobalValue();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch {
      // ignore — we clear local state either way
    }
    remove('token');
    remove('user');
    remove('wallets');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/dashboard">
          FFSD Wallet
        </Link>
        <div className="d-flex align-items-center text-white">
          {user && <span className="me-3 d-none d-sm-inline">{user.name}</span>}
          <button className="btn btn-sm btn-outline-light" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}