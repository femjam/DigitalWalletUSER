import { Outlet, NavLink } from 'react-router-dom';
import NavBar from './NavBar';

export default function AppLayout() {
  const linkClass = ({ isActive }) =>
    `nav-link ${isActive ? 'active fw-bold' : ''}`;

  return (
    <div className="min-vh-100 d-flex flex-column">
      <NavBar />
      <div className="bg-white border-bottom">
        <div className="container">
          <ul className="nav nav-pills py-2">
            <li className="nav-item">
              <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/fund" className={linkClass}>Fund</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/transfer" className={linkClass}>Transfer</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/transactions" className={linkClass}>History</NavLink>
            </li>
          </ul>
        </div>
      </div>
      <main className="flex-grow-1">
        <div className="container py-4">
          <Outlet />
        </div>
      </main>
      <footer className="text-center text-muted py-3 small border-top">
        Wallet App © {new Date().getFullYear()}
      </footer>
    </div>
  );
}