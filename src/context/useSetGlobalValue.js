import { useAppContext } from './AppContext';

export function useSetGlobalValue() {
  const { set, remove, clear } = useAppContext();
  return { set, remove, clear };
}