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
      if (mounted) setUser(mapProfile(row ?? {}, authUser));
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
      signOut: async () => {
        await supabase?.auth.signOut();
        setUser(null);
      },
      refreshProfile: async () => {
        const { data } = await supabase?.auth.getUser() ?? { data: { user: null } };
        if (!data.user) return;
        const result = await supabase?.from('riders').select('*').eq('user_id', data.user.id).maybeSingle();
        if (result?.data) setUser(mapProfile(result.data as Record<string, unknown>, data.user));
      },
      sessionExpired,
    }),
    [loading, sessionExpired, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}