import { Navigate, useLocation } from 'react-router-dom';
import { useGlobalValue } from '../context/useGlobalValue';

export default function ProtectedRoute({ children }) {
  const token = useGlobalValue('token');
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}