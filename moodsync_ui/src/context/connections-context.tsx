import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';

const STORAGE_KEY = 'moodsync.connections';

export type Connection = {
  handle: string;
  connectedAt: number;
};

type ConnectionsContextValue = {
  connections: Connection[];
  addConnection: (handle: string) => Connection;
  isConnected: (handle: string) => boolean;
};

const ConnectionsContext = createContext<ConnectionsContextValue | null>(null);

function isConnectionArray(value: unknown): value is Connection[] {
  return (
    Array.isArray(value) &&
    value.every((item) => typeof item === 'object' && item !== null && 'handle' in item)
  );
}

export function ConnectionsProvider({ children }: PropsWithChildren) {
  const [connections, setConnections] = useState<Connection[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!raw) return;
        const parsed: unknown = JSON.parse(raw);
        if (isConnectionArray(parsed)) setConnections(parsed);
      })
      .catch(() => {});
  }, []);

  const addConnection = useCallback((handle: string) => {
    let result: Connection = { handle, connectedAt: 0 };
    setConnections((previous) => {
      const existing = previous.find((item) => item.handle === handle);
      if (existing) {
        result = existing;
        return previous;
      }
      result = { handle, connectedAt: Date.now() };
      const next = [result, ...previous];
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
    return result;
  }, []);

  const isConnected = useCallback(
    (handle: string) => connections.some((item) => item.handle === handle),
    [connections],
  );

  const value = useMemo<ConnectionsContextValue>(
    () => ({ connections, addConnection, isConnected }),
    [connections, addConnection, isConnected],
  );

  return <ConnectionsContext.Provider value={value}>{children}</ConnectionsContext.Provider>;
}

export function useConnections() {
  const context = useContext(ConnectionsContext);
  if (!context) {
    throw new Error('useConnections must be used within a ConnectionsProvider');
  }
  return context;
}
