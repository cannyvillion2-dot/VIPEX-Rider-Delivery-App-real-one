import { Feather } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';

const bars = [42, 67, 48, 81, 63, 94, 72];

export default function AnalyticsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={[styles.container, { paddingTop: insets.top + 18, paddingBottom: insets.bottom + 90 }]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.eyebrow, { color: colors.mutedForeground }]}>YOUR PERFORMANCE</Text>
      <Text style={[styles.title, { color: colors.foreground }]}>Keep moving.</Text>
      <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>A quick look at your delivery week.</Text>
      <View style={[styles.heroCard, { backgroundColor: colors.charcoal }]}>
        <View>
          <Text style={[styles.cardEyebrow, { color: colors.mutedForeground }]}>THIS WEEK</Text>
          <Text style={[styles.heroValue, { color: colors.primary }]}>GH₵ 1,240.50</Text>
          <View style={styles.trend}><Feather name="trending-up" size={13} color={colors.success} /><Text style={[styles.trendText, { color: colors.success }]}>18.4% vs last week</Text></View>
        </View>
        <Feather name="activity" size={25} color={colors.primary} />
      </View>
      <View style={styles.metrics}>
        <View style={[styles.metricCard, { backgroundColor: colors.card, borderColor: colors.border }]}><Text style={[styles.metricNumber, { color: colors.foreground }]}>42</Text><Text style={[styles.metricLabel, { color: colors.mutedForeground }]}>DELIVERIES</Text></View>
        <View style={[styles.metricCard, { backgroundColor: colors.card, borderColor: colors.border }]}><Text style={[styles.metricNumber, { color: colors.foreground }]}>4.9</Text><Text style={[styles.metricLabel, { color: colors.mutedForeground }]}>RATING</Text></View>
      </View>
      <View style={[styles.chartCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.chartHeader}><View><Text style={[styles.cardLabel, { color: colors.foreground }]}>Earnings</Text><Text style={[styles.smallCopy, { color: colors.mutedForeground }]}>Last 7 days</Text></View><Text style={[styles.chartTotal, { color: colors.foreground }]}>GH₵ 1,240</Text></View>
        <View style={styles.chart}>
          {bars.map((height, index) => <View key={index} style={styles.barColumn}><View style={[styles.bar, { height, backgroundColor: index === 5 ? colors.primary : colors.secondary }]} /><Text style={[styles.day, { color: colors.mutedForeground }]}>{['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}</Text></View>)}
        </View>
      </View>
      <View style={[styles.tipCard, { backgroundColor: colors.yellowSoft }]}>
        <View style={[styles.tipIcon, { backgroundColor: colors.primary }]}><Feather name="zap" size={16} color={colors.ink} /></View>
        <View style={{ flex: 1 }}><Text style={[styles.tipTitle, { color: colors.foreground }]}>You’re on a roll</Text><Text style={[styles.smallCopy, { color: colors.mutedForeground }]}>Two more deliveries today takes you to your daily target.</Text></View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 18 },
  eyebrow: { fontFamily: 'Inter_600SemiBold', fontSize: 9, letterSpacing: 1.5 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 28, letterSpacing: -1, marginTop: 7 },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 12, marginTop: 5, marginBottom: 22 },
  heroCard: { borderRadius: 19, padding: 19, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  cardEyebrow: { fontFamily: 'Inter_600SemiBold', fontSize: 8, letterSpacing: 1.3 },
  heroValue: { fontFamily: 'Inter_700Bold', fontSize: 25, letterSpacing: -1, marginTop: 9 },
  trend: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 10 },
  trendText: { fontFamily: 'Inter_500Medium', fontSize: 10 },
  metrics: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  metricCard: { flex: 1, borderRadius: 15, borderWidth: 1, padding: 16 },
  metricNumber: { fontFamily: 'Inter_700Bold', fontSize: 24, letterSpacing: -0.7 },
  metricLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 8, letterSpacing: 1.2, marginTop: 5 },
  chartCard: { borderWidth: 1, borderRadius: 17, padding: 17, marginBottom: 12 },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardLabel: { fontFamily: 'Inter_700Bold', fontSize: 14 },
  smallCopy: { fontFamily: 'Inter_400Regular', fontSize: 10, lineHeight: 15, marginTop: 3 },
  chartTotal: { fontFamily: 'Inter_700Bold', fontSize: 13 },
  chart: { height: 136, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', paddingTop: 20 },
  barColumn: { alignItems: 'center', gap: 7, flex: 1 },
  bar: { width: 19, borderRadius: 7 },
  day: { fontFamily: 'Inter_600SemiBold', fontSize: 9 },
  tipCard: { borderRadius: 17, padding: 15, flexDirection: 'row', gap: 11, alignItems: 'center' },
  tipIcon: { width: 32, height: 32, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  tipTitle: { fontFamily: 'Inter_700Bold', fontSize: 12 },
});