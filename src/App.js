import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { useSetGlobalValue } from './context/useSetGlobalValue';
import { useGlobalValue } from './context/useGlobalValue';
import AppRoutes from './routes/AppRoutes';
import { me } from './api/auth';

function Bootstrap() {
  const { set } = useSetGlobalValue();
  const existingUser = useGlobalValue('user');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    if (existingUser) return; // already hydrated

    let cancelled = false;

    set('token', token);

    me()
      .then((user) => {
        if (!cancelled) set('user', user);
      })
      .catch(() => {
        if (!cancelled) {
          localStorage.removeItem('token');
          set('token', null);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [set, existingUser]);

  return <AppRoutes />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Bootstrap />
      </AppProvider>
    </BrowserRouter>
  );
}