import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { supabase } from '@/lib/supabase';

export type RiderAccount = {
  id: string;
  authUserId: string;
  name: string;
  email: string;
  phone: string;
  region: string;
  vehicleType: string;
  status: string;
  isOnline: boolean;
};

type AuthContextValue = {
  user: RiderAccount | null;
  loading: boolean;
  profileError: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (input: { email: string; password: string; name: string; phone: string }) => Promise<boolean>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  sessionExpired: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function mapProfile(row: Record<string, unknown>, authUser: { id: string; email?: string | null }): RiderAccount {
  return {
    id: String(row.id ?? authUser.id),
    authUserId: authUser.id,
    name: String(row.full_name ?? row.name ?? authUser.email?.split('@')[0] ?? 'SwiftDelivery rider'),
    email: String(row.email ?? authUser.email ?? ''),
    phone: String(row.phone ?? ''),
    region: String(row.region ?? ''),
    vehicleType: String(row.vehicle_type ?? row.vehicleType ?? 'Not set'),
    status: String(row.status ?? 'pending_verification'),
    isOnline: Boolean(row.is_online ?? row.isOnline ?? false),
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<RiderAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    let mounted = true;
    const loadProfile = async (authUser: { id: string; email?: string | null }) => {
      const attempts = [
        supabase.from('riders').select('*').eq('user_id', authUser.id).maybeSingle(),
        supabase.from('riders').select('*').eq('id', authUser.id).maybeSingle(),
      ];
      let row: Record<string, unknown> | null = null;
      for (const attempt of attempts) {
        const result = await attempt;
        if (!result.error && result.data) {
          row = result.data as Record<string, unknown>;
          break;
        }
      }
      if (mounted) {
        if (!row) {
          setUser(null);
          setProfileError('This account is not linked to an approved SwiftDelivery rider profile.');
        } else {
          setProfileError(null);
          setUser(mapProfile(row, authUser));
        }
      }
    };
    void supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) return loadProfile(data.session.user);
      setLoading(false);
    }).finally(() => mounted && setLoading(false));
    const { data: listener } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (!mounted) return;
      setSessionExpired(event === 'TOKEN_REFRESHED' && !nextSession);
      if (nextSession?.user) {
        setLoading(true);
        void loadProfile(nextSession.user).finally(() => mounted && setLoading(false));
      } else {
        setUser(null);
        if (event === 'SIGNED_OUT' || event === 'INITIAL_SESSION') setProfileError(null);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      profileError,
      signIn: async (email: string, password: string) => {
        if (!supabase) throw new Error('SwiftPex Supabase is not configured.');
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw new Error(error.message);
      },
      signUp: async ({ email, password, name, phone }) => {
        if (!supabase) throw new Error('SwiftPex Supabase is not configured.');
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { full_name: name.trim(), phone: phone.trim(), app_role: 'rider' } },
        });
        if (error) throw new Error(error.message);
        if (!data.session) return false;
        return true;
      },
      signOut: async () => {
        await supabase?.auth.signOut();
        setUser(null);
      },
      refreshProfile: async () => {
        const { data } = await supabase?.auth.getUser() ?? { data: { user: null } };
        if (!data.user) return;
        const result = await supabase?.from('riders').select('*').eq('user_id', data.user.id).maybeSingle();
        if (result?.data) {
          setProfileError(null);
          setUser(mapProfile(result.data as Record<string, unknown>, data.user));
        }
      },
      sessionExpired,
    }),
    [loading, profileError, sessionExpired, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}