import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { login as loginRequest, logout as logoutRequest, refreshSession, User } from '../../services/api';

type AuthValue = {
  user: User | null;
  ready: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    refreshSession()
      .then(setUser)
      .finally(() => setReady(true));
  }, []);

  const value = useMemo<AuthValue>(
    () => ({
      user,
      ready,
      login: async (email, password) => {
        setUser(await loginRequest(email, password));
      },
      logout: async () => {
        await logoutRequest();
        setUser(null);
      },
    }),
    [ready, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('AuthProvider ausente');
  return value;
}
