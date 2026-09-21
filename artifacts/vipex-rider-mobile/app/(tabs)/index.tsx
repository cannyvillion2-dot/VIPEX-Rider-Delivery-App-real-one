import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useAuth } from '@/context/AuthContext';
import { DeliveryJob, listJobs, setOnline } from '@/lib/riderApi';

const money = (value: number | null) => value == null ? '—' : `GHS ${value.toFixed(2)}`;

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user, refreshProfile } = useAuth();
  const [jobs, setJobs] = useState<DeliveryJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [offline, setOffline] = useState(false);

  const load = useCallback(async () => {
    setError('');
    try {
      setJobs(await listJobs());
      setOffline(false);
      await refreshProfile();
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : 'Could not load your delivery jobs.';
      setOffline(/network|fetch|offline|connection/i.test(message));
      setError(message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [refreshProfile]);
  useEffect(() => { void load(); }, [load]);

  const toggleOnline = async () => {
    try {
      await setOnline(!user?.isOnline);
      await refreshProfile();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not update rider availability.');
    }
  };

  const active = jobs.find((job) => !['DELIVERED', 'CANCELLED', 'RETURNED', 'FAILED'].includes(job.status));
  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 92 }]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); void load(); }} tintColor={colors.primary} />}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={[styles.logo, { backgroundColor: colors.primary }]}><Feather name="navigation" size={20} color={colors.ink} /></View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.eyebrow, { color: colors.mutedForeground }]}>SWIFTDELIVERY</Text>
          <Text style={[styles.title, { color: colors.foreground }]}>Hi, {user?.name.split(' ')[0] || 'Rider'}</Text>
        </View>
        <Pressable onPress={() => router.push('/notifications')} style={[styles.iconButton, { backgroundColor: colors.card, borderColor: colors.border }]} testID="button-notifications">
          <Feather name="bell" size={18} color={colors.foreground} />
        </Pressable>
      </View>

      <View style={[styles.onlineCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.cardLabel, { color: colors.mutedForeground }]}>RIDER AVAILABILITY</Text>
          <Text style={[styles.onlineTitle, { color: colors.foreground }]}>{user?.isOnline ? 'You are online' : 'You are offline'}</Text>
          <Text style={[styles.copy, { color: colors.mutedForeground }]}>{user?.isOnline ? 'Eligible assigned jobs can reach you.' : 'Go online when you are ready to ride.'}</Text>
        </View>
        <Pressable onPress={toggleOnline} style={[styles.toggle, { backgroundColor: user?.isOnline ? colors.success : colors.secondary }]} testID="button-online-toggle">
          <View style={[styles.thumb, user?.isOnline && styles.thumbOn, { backgroundColor: colors.white }]} />
        </Pressable>
      </View>

      {offline ? <StateCard colors={colors} icon="wifi-off" title="You appear to be offline" copy="Showing the last successful result is not possible until the live service responds." /> : null}
      {error ? <StateCard colors={colors} icon="alert-circle" title="Could not refresh jobs" copy={error} action="Retry" onAction={() => { setLoading(true); void load(); }} /> : null}
      <View style={styles.sectionHeader}><View><Text style={[styles.eyebrow, { color: colors.mutedForeground }]}>LIVE WORK QUEUE</Text><Text style={[styles.sectionTitle, { color: colors.foreground }]}>Your delivery jobs</Text></View><Pressable onPress={() => router.push('/jobs')}><Text style={[styles.link, { color: colors.accentForeground }]}>See all</Text></Pressable></View>
      {loading ? <StateCard colors={colors} icon="loader" title="Loading live jobs" copy="Checking the authorized SwiftPex queue…" /> : active ? <JobCard job={active} colors={colors} onPress={() => router.push(`/job/${active.id}`)} /> : <StateCard colors={colors} icon="package" title="No active delivery" copy="New authorized assignments will appear here when available." action="Open jobs" onAction={() => router.push('/jobs')} />}
      <View style={styles.quickRow}>
        <Pressable onPress={() => router.push('/earnings')} style={[styles.quickCard, { backgroundColor: colors.charcoal }]}><Feather name="bar-chart-2" size={19} color={colors.primary} /><Text style={[styles.quickTitle, { color: colors.white }]}>Earnings</Text><Text style={[styles.quickCopy, { color: colors.mutedForeground }]}>Server-calculated wallet</Text></Pressable>
        <Pressable onPress={() => router.push('/settings')} style={[styles.quickCard, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }]}><Feather name="settings" size={19} color={colors.accentForeground} /><Text style={[styles.quickTitle, { color: colors.foreground }]}>Settings</Text><Text style={[styles.quickCopy, { color: colors.mutedForeground }]}>Account and session</Text></Pressable>
      </View>
    </ScrollView>
  );
}

export function JobCard({ job, colors, onPress }: { job: DeliveryJob; colors: ReturnType<typeof useColors>; onPress: () => void }) {
  return <Pressable onPress={onPress} style={[styles.jobCard, { backgroundColor: colors.card, borderColor: colors.border }]}><View style={styles.jobTop}><Text style={[styles.jobReference, { color: colors.foreground }]}>{job.reference}</Text><Text style={[styles.status, { color: colors.accentForeground, backgroundColor: colors.yellowSoft }]}>{job.status}</Text></View><Text style={[styles.address, { color: colors.foreground }]} numberOfLines={1}>{job.pickupAddress || 'Pickup address unavailable'}</Text><Feather name="arrow-down" size={14} color={colors.mutedForeground} /><Text style={[styles.address, { color: colors.foreground }]} numberOfLines={1}>{job.destinationAddress || 'Destination unavailable'}</Text><View style={styles.jobBottom}><Text style={[styles.copy, { color: colors.mutedForeground }]}>{job.recipientName || 'Recipient details protected'}</Text><Text style={[styles.fee, { color: colors.foreground }]}>{money(job.riderFee)}</Text></View></Pressable>;
}

function StateCard({ colors, icon, title, copy, action, onAction }: { colors: ReturnType<typeof useColors>; icon: keyof typeof Feather.glyphMap; title: string; copy: string; action?: string; onAction?: () => void }) {
  return <View style={[styles.stateCard, { backgroundColor: colors.card, borderColor: colors.border }]}><View style={[styles.stateIcon, { backgroundColor: colors.yellowSoft }]}><Feather name={icon} size={18} color={colors.accentForeground} /></View><Text style={[styles.stateTitle, { color: colors.foreground }]}>{title}</Text><Text style={[styles.copy, { color: colors.mutedForeground }]}>{copy}</Text>{action && onAction ? <Pressable onPress={onAction} style={[styles.smallButton, { backgroundColor: colors.primary }]}><Text style={[styles.smallButtonText, { color: colors.ink }]}>{action}</Text></Pressable> : null}</View>;
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 18 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 11, marginBottom: 18 },
  logo: { width: 45, height: 45, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  eyebrow: { fontFamily: 'Inter_600SemiBold', fontSize: 9, letterSpacing: 1.4 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 22, letterSpacing: -0.7, marginTop: 4 },
  iconButton: { width: 42, height: 42, borderRadius: 13, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  onlineCard: { borderRadius: 17, borderWidth: 1, padding: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 27 },
  cardLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 8, letterSpacing: 1.2 },
  onlineTitle: { fontFamily: 'Inter_700Bold', fontSize: 16, marginTop: 6 },
  copy: { fontFamily: 'Inter_400Regular', fontSize: 11, lineHeight: 16, marginTop: 4 },
  toggle: { width: 48, height: 28, borderRadius: 20, padding: 3, justifyContent: 'center' },
  thumb: { width: 22, height: 22, borderRadius: 11 },
  thumbOn: { alignSelf: 'flex-end' },
  sectionHeader: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 11 },
  sectionTitle: { fontFamily: 'Inter_700Bold', fontSize: 19, marginTop: 4 },
  link: { fontFamily: 'Inter_600SemiBold', fontSize: 10 },
  jobCard: { borderWidth: 1, borderRadius: 17, padding: 15, marginBottom: 12 },
  jobTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 13 },
  jobReference: { fontFamily: 'Inter_700Bold', fontSize: 14 },
  status: { fontFamily: 'Inter_700Bold', fontSize: 8, letterSpacing: 0.5, borderRadius: 99, paddingHorizontal: 8, paddingVertical: 6 },
  address: { fontFamily: 'Inter_600SemiBold', fontSize: 11, marginVertical: 4 },
  jobBottom: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 11, alignItems: 'center' },
  fee: { fontFamily: 'Inter_700Bold', fontSize: 12 },
  stateCard: { borderWidth: 1, borderRadius: 17, padding: 16, marginBottom: 12 },
  stateIcon: { width: 34, height: 34, borderRadius: 11, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  stateTitle: { fontFamily: 'Inter_700Bold', fontSize: 14 },
  smallButton: { alignSelf: 'flex-start', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 9, marginTop: 12 },
  smallButtonText: { fontFamily: 'Inter_700Bold', fontSize: 10 },
  quickRow: { flexDirection: 'row', gap: 10, marginTop: 10 },
  quickCard: { flex: 1, borderRadius: 16, padding: 14, minHeight: 112 },
  quickTitle: { fontFamily: 'Inter_700Bold', fontSize: 13, marginTop: 14 },
  quickCopy: { fontFamily: 'Inter_400Regular', fontSize: 9, marginTop: 4 },
});