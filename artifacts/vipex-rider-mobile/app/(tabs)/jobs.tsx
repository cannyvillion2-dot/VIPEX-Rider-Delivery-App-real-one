import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { DeliveryJob, listJobs } from '@/lib/riderApi';
import { JobCard } from './index';

export default function JobsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [jobs, setJobs] = useState<DeliveryJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const load = useCallback(async () => {
    try { setError(''); setJobs(await listJobs()); } catch (cause) { setError(cause instanceof Error ? cause.message : 'Could not load authorized jobs.'); } finally { setLoading(false); setRefreshing(false); }
  }, []);
  useEffect(() => { void load(); }, [load]);
  return <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={[styles.content, { paddingTop: insets.top + 18, paddingBottom: insets.bottom + 90 }]} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); void load(); }} tintColor={colors.primary} />}><View style={styles.header}><View><Text style={[styles.eyebrow, { color: colors.mutedForeground }]}>AUTHORIZED QUEUE</Text><Text style={[styles.title, { color: colors.foreground }]}>Delivery jobs</Text></View><Pressable onPress={() => router.push('/notifications')}><Feather name="bell" size={19} color={colors.foreground} /></Pressable></View>{loading ? <Message colors={colors} icon="loader" title="Loading jobs" copy="Fetching the live rider queue…" /> : error ? <Message colors={colors} icon="alert-circle" title="Unable to load jobs" copy={error} action="Retry" onPress={() => { setLoading(true); void load(); }} /> : jobs.length === 0 ? <Message colors={colors} icon="package" title="No jobs available" copy="There are no jobs authorized for this rider right now." /> : jobs.map((job) => <JobCard key={job.id} job={job} colors={colors} onPress={() => router.push(`/job/${job.id}`)} />)}</ScrollView>;
}
function Message({ colors, icon, title, copy, action, onPress }: { colors: ReturnType<typeof useColors>; icon: keyof typeof Feather.glyphMap; title: string; copy: string; action?: string; onPress?: () => void }) {
  return <View style={[styles.message, { backgroundColor: colors.card, borderColor: colors.border }]}><Feather name={icon} size={24} color={colors.accentForeground} /><Text style={[styles.messageTitle, { color: colors.foreground }]}>{title}</Text><Text style={[styles.copy, { color: colors.mutedForeground }]}>{copy}</Text>{action && onPress ? <Pressable onPress={onPress} style={[styles.action, { backgroundColor: colors.primary }]}><Text style={{ fontFamily: 'Inter_700Bold', fontSize: 10, color: colors.ink }}>{action}</Text></Pressable> : null}</View>;
}
const styles = StyleSheet.create({ content: { paddingHorizontal: 18 }, header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }, eyebrow: { fontFamily: 'Inter_600SemiBold', fontSize: 9, letterSpacing: 1.4 }, title: { fontFamily: 'Inter_700Bold', fontSize: 28, letterSpacing: -1, marginTop: 7 }, message: { borderWidth: 1, borderRadius: 17, padding: 18, alignItems: 'flex-start' }, messageTitle: { fontFamily: 'Inter_700Bold', fontSize: 15, marginTop: 13 }, copy: { fontFamily: 'Inter_400Regular', fontSize: 11, lineHeight: 16, marginTop: 5 }, action: { paddingHorizontal: 13, paddingVertical: 9, borderRadius: 10, marginTop: 13 } });