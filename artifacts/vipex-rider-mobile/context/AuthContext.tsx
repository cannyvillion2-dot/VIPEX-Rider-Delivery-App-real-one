import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { supabase } from '@/lib/supabase';

export type RiderAccount = {
  id: string;
  name: string;
  phone: string;
  region: string;
  vehicleType: string;
  status: string;
  subscriptionStatus: string;
  isOnline: boolean;
  subscriptionActive?: boolean;
  subscriptionProvider?: string;
};

type AuthContextValue = {
  user: RiderAccount | null;
  loading: boolean;
  saveRider: (rider: RiderAccount) => Promise<void>;
  signOut: () => Promise<void>;
  activateSubscription: (provider: string) => Promise<void>;
};

const ACCOUNT_KEY = '@vipex/rider-account';
const AuthContext = createContext<AuthContextValue | null>(null);

function readableSupabaseError(error: { message?: string } | null | undefined) {
  const message = error?.message || 'Supabase could not complete that request.';
  const lowerMessage = message.toLowerCase();
  if (lowerMessage.includes('relation') || lowerMessage.includes('riders')) {
    return 'The riders table is not ready. Run supabase_schema.sql in your Supabase SQL Editor, then try again.';
  }
  if (lowerMessage.includes('row-level security') || lowerMessage.includes('policy')) {
    return 'Supabase is blocking this request. Run the anon riders policies from supabase_schema.sql, then try again.';
  }
  return message;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<RiderAccount | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restore = async () => {
      try {
        const stored = await AsyncStorage.getItem(ACCOUNT_KEY);
        if (stored) {
          const account = JSON.parse(stored) as Partial<RiderAccount>;
          if (account.id && account.name && account.phone && account.region) {
            setUser({
              vehicleType: account.vehicleType || 'Motor Okada',
              status: account.status || 'pending_verification',
              subscriptionStatus: account.subscriptionStatus || 'inactive',
              isOnline: account.isOnline ?? false,
              ...account,
            } as RiderAccount);
          } else {
            await AsyncStorage.removeItem(ACCOUNT_KEY);
          }
        }
      } catch {
        await AsyncStorage.removeItem(ACCOUNT_KEY).catch(() => undefined);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    void restore();
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      saveRider: async (rider: RiderAccount) => {
        await AsyncStorage.setItem(ACCOUNT_KEY, JSON.stringify(rider));
        setUser(rider);
      },
      signOut: async () => {
        await AsyncStorage.removeItem(ACCOUNT_KEY);
        setUser(null);
      },
      activateSubscription: async (provider: string) => {
        if (!supabase || !user) throw new Error('Your rider account is not ready. Please create an account again.');
        const expires = new Date();
        expires.setMonth(expires.getMonth() + 1);
        const { error } = await supabase.from('rider_subscriptions').upsert(
          {
            rider_id: user.id,
            provider,
            amount_ghs: 20,
            status: 'active',
            starts_at: new Date().toISOString(),
            expires_at: expires.toISOString(),
          },
          { onConflict: 'rider_id' },
        );
        if (error) throw new Error(readableSupabaseError(error));

        const nextUser = {
          ...user,
          subscriptionActive: true,
          subscriptionProvider: provider,
          subscriptionStatus: 'active',
        };
        await AsyncStorage.setItem(ACCOUNT_KEY, JSON.stringify(nextUser));
        setUser(nextUser);
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