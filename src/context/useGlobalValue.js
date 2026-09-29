import { useAppContext } from './AppContext';

export function useGlobalValue(key) {
  const { get } = useAppContext();
  return get(key);
}