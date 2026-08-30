import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type RiderAccount = {
  name: string;
  phone: string;
  region: string;
};

type AuthContextValue = {
  user: RiderAccount | null;
  loading: boolean;
  signIn: (account: RiderAccount) => Promise<void>;
  signOut: () => Promise<void>;
};

const ACCOUNT_KEY = '@vipex/rider-account';
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<RiderAccount | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(ACCOUNT_KEY)
      .then((stored) => {
        if (!stored) return;
        const account = JSON.parse(stored) as Partial<RiderAccount>;
        if (account.name && account.phone && account.region) {
          setUser(account as RiderAccount);
        } else {
          return AsyncStorage.removeItem(ACCOUNT_KEY);
        }
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      signIn: async (account: RiderAccount) => {
        await AsyncStorage.setItem(ACCOUNT_KEY, JSON.stringify(account));
        setUser(account);
      },
      signOut: async () => {
        await AsyncStorage.removeItem(ACCOUNT_KEY);
        setUser(null);
      },
    }),
    [loading, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}