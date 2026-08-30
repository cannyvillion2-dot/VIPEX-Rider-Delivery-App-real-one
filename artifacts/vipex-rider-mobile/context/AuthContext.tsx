import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { supabase } from '@/lib/supabase';

export type RiderAccount = {
  id: string;
  name: string;
  phone: string;
  region: string;
  subscriptionActive?: boolean;
  subscriptionProvider?: string;
};

type AuthContextValue = {
  user: RiderAccount | null;
  loading: boolean;
  signIn: (account: Omit<RiderAccount, 'id'>) => Promise<void>;
  signOut: () => Promise<void>;
  activateSubscription: (provider: string) => Promise<void>;
};

const ACCOUNT_KEY = '@vipex/rider-account';
const AuthContext = createContext<AuthContextValue | null>(null);

function readableSupabaseError(error: { message?: string } | null | undefined) {
  const message = error?.message || 'Supabase could not complete that request.';
  if (message.toLowerCase().includes('anonymous')) {
    return 'Supabase Anonymous Sign-Ins are not enabled yet. Enable them in Supabase Auth settings, then try again.';
  }
  if (message.toLowerCase().includes('relation') || message.toLowerCase().includes('rider_profiles')) {
    return 'The VIPEX rider tables are not ready. Run supabase_schema.sql in your Supabase SQL Editor, then try again.';
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
            setUser(account as RiderAccount);
            return;
          }
          await AsyncStorage.removeItem(ACCOUNT_KEY);
        }

        if (!supabase) return;
        const { data: sessionData } = await supabase.auth.getSession();
        const authUser = sessionData.session?.user;
        if (!authUser) return;
        const { data: profile } = await supabase
          .from('rider_profiles')
          .select('id, full_name, phone, region')
          .eq('id', authUser.id)
          .maybeSingle();
        if (profile) {
          const account = {
            id: profile.id,
            name: profile.full_name,
            phone: profile.phone,
            region: profile.region,
          };
          await AsyncStorage.setItem(ACCOUNT_KEY, JSON.stringify(account));
          setUser(account);
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
      signIn: async (account: Omit<RiderAccount, 'id'>) => {
        if (!supabase) {
          throw new Error('Supabase is not configured for this app.');
        }

        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw new Error(readableSupabaseError(sessionError));

        let authUser = sessionData.session?.user;
        if (!authUser) {
          const anonymous = await supabase.auth.signInAnonymously();
          if (anonymous.error || !anonymous.data.user) {
            throw new Error(readableSupabaseError(anonymous.error));
          }
          authUser = anonymous.data.user;
        }

        const { data, error } = await supabase
          .from('rider_profiles')
          .upsert(
            {
              id: authUser.id,
              full_name: account.name,
              phone: account.phone,
              region: account.region,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'id' },
          )
          .select('id, full_name, phone, region')
          .single();

        if (error || !data) throw new Error(readableSupabaseError(error));

        const nextUser = {
          id: data.id,
          name: data.full_name,
          phone: data.phone,
          region: data.region,
          subscriptionActive: false,
        };
        await AsyncStorage.setItem(ACCOUNT_KEY, JSON.stringify(nextUser));
        setUser(nextUser);
      },
      signOut: async () => {
        if (supabase) await supabase.auth.signOut();
        await AsyncStorage.removeItem(ACCOUNT_KEY);
        setUser(null);
      },
      activateSubscription: async (provider: string) => {
        if (!supabase || !user) throw new Error('Your rider session is not ready. Please sign in again.');
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

        const nextUser = { ...user, subscriptionActive: true, subscriptionProvider: provider };
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