import { createContext, useContext, useState, useCallback, useMemo } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [items, setItems] = useState([]);

  const get = useCallback(
    (key) => items.find((i) => i.key === key)?.value,
    [items]
  );

  const set = useCallback((key, value) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) => (i.key === key ? { key, value } : i));
      }
      return [...prev, { key, value }];
    });
  }, []);

  const remove = useCallback((key) => {
    setItems((prev) => prev.filter((i) => i.key !== key));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({ items, get, set, remove, clear }),
    [items, get, set, remove, clear]
  );

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used inside AppProvider');
  return ctx;
}